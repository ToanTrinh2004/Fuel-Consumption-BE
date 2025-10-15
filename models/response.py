from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
class PredictionResponse(BaseModel):
    """Prediction response"""
    fuel_consumption: float
    unit: str = "units"
    parameters: Dict[str, Any]

class ChatWithPredictionResponse(BaseModel):
    """Combined response"""
    response: str
    prediction_made: bool = False
    prediction_result: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    """Chat response"""
    response: str
    is_function_call: bool = False
    function_parameters: Optional[Dict[str, Any]] = None