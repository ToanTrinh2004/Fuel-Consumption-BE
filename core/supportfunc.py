import asyncio
import random
import re
from typing import Any, Dict, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from core.models import LLMRoleExample, State
from services.llm_service import llm_service
from services.model_service import model_service

STRUCTURED_FIELD_MAP = {
    "speedOverGround": "Ship_SpeedOverGround",
    "windSpeed10M": "Weather_WindSpeed10M",
    "waveHeight": "Weather_WaveHeight",
    "wavePeriod": "Weather_WavePeriod",
    "seaFloorDepth": "Environment_SeaFloorDepth",
    "temperature2M": "Weather_Temperature2M",
    "oceanCurrentVelocity": "Weather_OceanCurrentVelocity",
    "shipType": "ship_type",
}

PATTERNS = {
    "Ship_SpeedOverGround": r"(?:toc\s*do|ship[_\s-]*speed(?:[_\s-]*over)?[_\s-]*ground)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
    "Environment_SeaFloorDepth": r"(?:do\s*sau(?:\s*day\s*bien)?|sea[_\s-]*floor[_\s-]*depth)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
    "Weather_Temperature2M": r"(?:nhiet\s*do|temperature(?:[_\s-]*2m)?)\s*[:\-]?\s*(-?\d+(?:\.\d+)?)",
    "Weather_OceanCurrentVelocity": r"(?:dong\s*chay(?:\s*dai\s*duong)?|ocean[_\s-]*current[_\s-]*velocity)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
    "Weather_WindSpeed10M": r"(?:toc\s*do\s*gio|wind[_\s-]*speed(?:[_\s-]*10m)?)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
    "Weather_WaveHeight": r"(?:do\s*cao\s*song|wave[_\s-]*height)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
    "Weather_WavePeriod": r"(?:chu\s*ky\s*song|wave[_\s-]*period)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
    "ship_type": r"(?:ship[_\s-]*type\s*[:\-]?\s*)?(ceto|poseidon|triton)",
}

LABELS = {
    "Ship_SpeedOverGround": "Tốc độ tàu",
    "Environment_SeaFloorDepth": "Độ sâu đáy biển",
    "Weather_Temperature2M": "Nhiệt độ",
    "Weather_OceanCurrentVelocity": "Tốc độ dòng chảy",
    "Weather_WindSpeed10M": "Tốc độ gió",
    "Weather_WaveHeight": "Độ cao sóng",
    "Weather_WavePeriod": "Chu kỳ sóng",
    "ship_type": "Loại tàu",
}


def get_example_response(db: Session, user_message: str):
    # Tìm câu gần giống (LIKE)
    example = (
        db.query(LLMRoleExample)
        .filter(func.lower(LLMRoleExample.user_prompt).like(f"%{user_message.lower()}%"))
        .first()
    )
    if example:
        return example.assistant_response
    return None


def call_llm(prediction_value: float, params: Dict[str, Any]) -> str:
    assistant_message = (
    f"Bạn PHẢI trả lời HOÀN TOÀN bằng tiếng Việt, "
    f"ngay cả khi các tham số hoặc dữ liệu đầu vào có chứa tiếng Anh (dịch các dữ liệu đầu vào sang tiếng Việt).\n\n"
    f"Dựa trên các thông số chuyến đi {params}"
    f"mức tiêu thụ nhiên liệu là {prediction_value:.2f} đơn vị.\n\n"
    f"Bây giờ để tôi giải thích ý nghĩa của kết quả này và những yếu tố nào đã ảnh hưởng đến dự đoán..."
    )
    elaboration_prompt = "Vui lòng giải thích chi tiết về dự đoán này với những thông tin hữu ích."
    result_messages = [{"role": "assistant", "content": assistant_message}]
    elaboration_messages = result_messages + [{"role": "user", "content": elaboration_prompt}]
    final_response = asyncio.run(llm_service.chat(elaboration_messages, "vi"))
    return final_response


def _normalize_ship_type(value: Any) -> Optional[str]:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    return text.capitalize()


def _normalize_numeric(value: Any) -> Optional[float]:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _extract_from_structured(structured_params: Dict[str, Any]) -> Dict[str, Any]:
    normalized: Dict[str, Any] = {}
    for source_key, target_key in STRUCTURED_FIELD_MAP.items():
        if source_key not in structured_params:
            continue
        value = structured_params[source_key]
        if target_key == "ship_type":
            ship_type = _normalize_ship_type(value)
            if ship_type:
                normalized[target_key] = ship_type
        else:
            numeric = _normalize_numeric(value)
            if numeric is not None:
                normalized[target_key] = numeric
    return normalized


def extract_params(
    message: str,
    conversation_id: int,
    db: Session,
    structured_params: Optional[Dict[str, Any]] = None,
):
    extracted: Dict[str, Any] = {}

    if structured_params:
        extracted.update(_extract_from_structured(structured_params))

    for key, pattern in PATTERNS.items():
        if extracted.get(key) is not None:
            continue
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            extracted[key] = match.group(1)

    if not extracted:
        return False

    state = db.query(State).filter_by(conversation_id=conversation_id).first()
    if not state:
        state = State(conversation_id=conversation_id)
        db.add(state)

    all_fields = list(PATTERNS.keys())
    previously_full = all(getattr(state, field) is not None for field in all_fields)

    for key, value in extracted.items():
        if key == "ship_type":
            setattr(state, key, _normalize_ship_type(value))
        else:
            numeric = _normalize_numeric(value)
            setattr(state, key, numeric)

    db.commit()

    missing = [field for field in all_fields if getattr(state, field) is None]
    provided = [key for key in extracted.keys()]
    params = {field: getattr(state, field) for field in all_fields}

    if previously_full:
        prediction = model_service.predict(params)
        answer = call_llm(prediction, params)
        response = (
            f"Cảm ơn bạn đã cập nhật thông tin về {', '.join(LABELS[p] for p in provided)}. "
            f"Tôi sẽ tính toán lại dự đoán dựa trên dữ liệu mới."
        )
        return {
            "done": True,
            "message": response,
            "updated": True,
            "prediction": prediction,
            "llm_response": answer,
            "params": params,
        }

    if missing:
        intro = random.choice(["Tuyệt vời!", "Rất tốt!", "Cảm ơn bạn!", "Tốt lắm!"])
        transition = random.choice([
            "Để có kết quả chính xác nhất,",
            "Để tôi dự đoán tốt hơn,",
            "Cần thêm một chút dữ liệu,"
        ])
        ask = random.choice([
            "bạn vui lòng cung cấp thêm về",
            "bạn có thể nói rõ hơn về",
            "bạn giúp tôi bổ sung thông tin về"
        ])

        response = (
            f"{intro} Tôi đã ghi nhận {', '.join(LABELS[p] for p in provided)}. "
            f"{transition} {ask} {', '.join(LABELS[m] for m in missing)} không?"
        )

        return {"done": False, "message": response, "updated": False, "params": params}

    result = model_service.predict(params)
    llm_answer = call_llm(result, params)

    return {
        "done": True,
        "message": "Tôi đã có đủ thông tin, đang tính toán mức tiêu thụ nhiên liệu...",
        "updated": False,
        "result": result,
        "llm_response": llm_answer,
        "params": params,
    }
