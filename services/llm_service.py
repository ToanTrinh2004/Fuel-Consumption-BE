import httpx
import json
import re
from typing import List, Dict, Any, Optional, Tuple

# System Prompts
SYSTEM_PROMPT_EN = """You are a helpful maritime fuel consumption assistant powered by AI.

**YOUR ROLE:**
You do not calculate fuel consumption yourself.
Your job is to collect all necessary parameters from the user and then CALL the prediction model.

**IMPORTANT RULES:**
- NEVER estimate or calculate fuel consumption by yourself.
- ONLY call the function `predict_fuel_consumption` once you have all required parameters.
- Respond politely and in natural language, but do not perform any math.
- If parameters are missing, ask for them.

**REQUIRED PARAMETERS:**
- distance (km)
- engine_efficiency (0-1)
- ship_type: Oil Service Boat, Surfer Boat, or Tanker Ship
- route_id: Lagos-Apapa, Port Harcourt-Lagos, or Warri-Bonny
- month (1-12)
- fuel_type: HFO or Other
- weather_conditions: Clear, Moderate, or Stormy

**FUNCTION CALL FORMAT:**
When all parameters are provided, respond ONLY with:

CALL_FUNCTION: predict_fuel_consumption
{
  "distance": <value>,
  "engine_efficiency": <value>,
  "ship_type": "<type>",
  "route_id": "<route>",
  "month": <value>,
  "fuel_type": "<type>",
  "weather_conditions": "<condition>"
}

Do not include any explanations, notes, or calculations before or after this call."""


SYSTEM_PROMPT_VI = """Bạn là trợ lý AI hỗ trợ dự đoán tiêu thụ nhiên liệu hàng hải.

**VAI TRÒ CỦA BẠN:**
Bạn **không tự tính toán** lượng nhiên liệu tiêu thụ.
Nhiệm vụ của bạn là **thu thập đầy đủ các tham số cần thiết từ người dùng**, sau đó **GỌI hàm dự đoán**.

**QUY TẮC QUAN TRỌNG:**
- KHÔNG bao giờ tự ước lượng hoặc tính toán lượng nhiên liệu.
- CHỈ được gọi hàm `predict_fuel_consumption` khi đã có đủ tất cả tham số.
- Luôn trả lời lịch sự, tự nhiên bằng **tiếng Việt**.
- Nếu người dùng chưa cung cấp đủ thông tin, hãy hỏi thêm.
- Nếu người dùng nói tiếng Anh, hãy **dịch sang tiếng Việt** trước khi trả lời.

**CÁC THAM SỐ BẮT BUỘC:**
- distance (km): Quãng đường
- engine_efficiency (0-1): Hiệu suất động cơ
- ship_type: Oil Service Boat, Surfer Boat, hoặc Tanker Ship
- route_id: Lagos-Apapa, Port Harcourt-Lagos, hoặc Warri-Bonny
- month (1-12): Tháng
- fuel_type: HFO hoặc Other
- weather_conditions: Clear, Moderate, hoặc Stormy

**ĐỊNH DẠNG GỌI HÀM:**
Khi đã có đủ tất cả tham số, hãy chỉ phản hồi theo đúng định dạng sau:

CALL_FUNCTION: predict_fuel_consumption
{
  "distance": <giá_trị>,
  "engine_efficiency": <giá_trị>,
  "ship_type": "<loại_tàu>",
  "route_id": "<tuyến>",
  "month": <tháng>,
  "fuel_type": "<nhiên_liệu>",
  "weather_conditions": "<thời_tiết>"
}

Không thêm bất kỳ lời giải thích, chú thích hoặc kết quả nào trước hoặc sau lời gọi hàm này.
"""



class LLMService:
    def __init__(
        self, 
        api_url: str = "http://localhost:1234/v1/chat/completions",
        model_name: str = "llama3-8b-instruct",
        temperature: float = 0.7,
        max_tokens: int = 1024
    ):
        self.api_url = api_url
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
    
    def get_system_prompt(self, language: str = "en") -> str:
        """Get system prompt for specified language"""
        return SYSTEM_PROMPT_VI if language == "vi" else SYSTEM_PROMPT_EN
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        language: str = "en"
    ) -> str:
        """
        Send chat request to LLM
        
        Args:
            messages: List of {'role': 'user/assistant', 'content': '...'}
            language: 'en' or 'vi'
        
        Returns:
            LLM response text
        """
        # Prepend system prompt
        system_prompt = self.get_system_prompt(language)
        full_messages = [
            {"role": "system", "content": system_prompt},
            *messages
        ]
        
        payload = {
            "model": self.model_name,
            "messages": full_messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "stream": False
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(self.api_url, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.HTTPError as e:
            print(f" LLM HTTP error: {e}")
            raise
        except Exception as e:
            print(f" LLM error: {e}")
            raise
    
    def parse_function_call(self, response: str) -> Tuple[bool, Optional[Dict[str, Any]]]:
        """
        Check if LLM response contains a function call
        
        Returns:
            (is_function_call, parameters_dict)
        """
        if re.search(r"CALL_?\s*FUNCTION\s*:\s*predict_fuel_consumption", response, re.IGNORECASE):
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                try:
                    params = json.loads(json_match.group())
                    return True, params
                except json.JSONDecodeError:
                    return False, None
        return False, None

# Singleton instance
llm_service = LLMService()