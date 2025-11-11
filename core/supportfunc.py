import asyncio
import random
import re
from sqlalchemy import func
from sqlalchemy.orm import Session
from core.models import LLMRoleExample, State

from services.llm_service import llm_service
from services.model_service import model_service
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
def call_llm(prediction_value: float,params : dict) -> str:
    assistant_message = (
    f"Bạn PHẢI trả lời HOÀN TOÀN bằng tiếng Việt, "
    f"ngay cả khi các tham số hoặc dữ liệu đầu vào có chứa tiếng Anh.\n\n"
    f"Dựa trên các thông số chuyến đi {params}"
    f"mức tiêu thụ nhiên liệu là {prediction_value:.2f} đơn vị.\n\n"
    f"Bây giờ để tôi giải thích ý nghĩa của kết quả này và những yếu tố nào đã ảnh hưởng đến dự đoán..."
    )
    elaboration_prompt = "Vui lòng giải thích chi tiết về dự đoán này với những thông tin hữu ích."
    result_messages = [{"role": "assistant", "content": assistant_message}]
    elaboration_messages = result_messages + [{"role": "user", "content": elaboration_prompt}]
    final_response = asyncio.run(llm_service.chat(elaboration_messages, "vi"))
    return final_response
def extract_params(message: str, conversation_id: int, db: Session):
    msg = message.lower()

    
    patterns = {
        "Ship_SpeedOverGround": r"tốc độ(?:\s|\_)?(?:over ground)?\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "Environment_SeaFloorDepth": r"(?:độ sâu|sea floor depth)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "Weather_Temperature2M": r"(?:nhiệt độ|temperature)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "Weather_OceanCurrentVelocity": r"(?:dòng chảy|ocean current velocity)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "Weather_WindSpeed10M": r"(?:gió|wind speed)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "Weather_WaveHeight": r"(?:độ cao sóng|wave height)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "Weather_WavePeriod": r"(?:chu kỳ sóng|wave period)\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        "ship_type": r"(ceto|poseidon|triton)"
    }

    labels = {
        "Ship_SpeedOverGround": "Tốc độ tàu",
        "Environment_SeaFloorDepth": "Độ sâu đáy biển",
        "Weather_Temperature2M": "Nhiệt độ",
        "Weather_OceanCurrentVelocity": "Tốc độ dòng chảy biển",
        "Weather_WindSpeed10M": "Tốc độ gió",
        "Weather_WaveHeight": "Độ cao sóng",
        "Weather_WavePeriod": "Chu kỳ sóng",
        "ship_type": "Loại tàu"
    }

    extracted = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, msg)
        if match:
            extracted[key] = match.group(1)

    if not extracted:
        return False

    def clean_values(values: dict):
        cleaned = values.copy()

        for k in cleaned:
            if k == "ship_type":
                cleaned[k] = cleaned[k].capitalize()
            else:
                try:
                    cleaned[k] = float(cleaned[k])
                except:
                    cleaned[k] = None

        return cleaned

    extracted = clean_values(extracted)

    state = db.query(State).filter_by(conversation_id=conversation_id).first()
    if not state:
        state = State(conversation_id=conversation_id)
        db.add(state)

    all_fields = list(patterns.keys())
    previously_full = all(getattr(state, f) is not None for f in all_fields)

    for key, value in extracted.items():
        setattr(state, key, value)

    db.commit()

    missing = [f for f in all_fields if getattr(state, f) is None]
    provided = list(extracted.keys())

    params = {f: getattr(state, f) for f in all_fields}

    if previously_full:
        prediction = model_service.predict(params)
        answer = call_llm(prediction, params)
        response = (
            f"Cảm ơn bạn đã cập nhật thông tin về {', '.join(labels[p] for p in provided)}. "
            f"Tôi sẽ tính toán lại dự đoán dựa trên dữ liệu mới."
        )
        return {
            "done": True,
            "message": response,
            "updated": True,
            "prediction": prediction,
            "llm_response": answer
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
            f"{intro} Tôi đã ghi nhận {', '.join(labels[p] for p in provided)}. "
            f"{transition} {ask} {', '.join(labels[m] for m in missing)} không?"
        )

        return {"done": False, "message": response, "updated": False}

    result = model_service.predict(params)
    llm_answer = call_llm(result, params)

    return {
        "done": True,
        "message": "Tôi đã có đủ thông tin, đang tính toán mức tiêu thụ nhiên liệu...",
        "updated": False,
        "result": result,
        "llm_response": llm_answer
    }
