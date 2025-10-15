from typing import Dict, List
from pydantic import BaseModel, Field
class ChatRequest(BaseModel):
    """Chat request with conversation history"""
    messages: List[Dict[str, str]] = Field(
        ..., 
        description="List of messages: [{'role': 'user', 'content': '...'}]",
        example=[{"role": "user", "content": "I need to predict fuel consumption"}]
    )
    language: str = Field(
        default="en",
        description="Language: 'en' or 'vi'",
        example="en"
    )
class ChatWithPredictionRequest(BaseModel):
    """Combined chat + auto prediction"""
    messages: List[Dict[str, str]]
    language: str = "en"

class PredictionRequest(BaseModel):
    """Direct prediction request"""
    distance: float = Field(..., gt=0, description="Distance in km", example=500.0)
    engine_efficiency: float = Field(..., gt=0, le=1, description="Engine efficiency (0-1)", example=0.85)
    ship_type: str = Field(..., description="Ship type", example="Tanker Ship")
    route_id: str = Field(..., description="Route", example="Lagos-Apapa")
    month: int = Field(..., ge=1, le=12, description="Month (1-12)", example=6)
    fuel_type: str = Field(..., description="Fuel type", example="HFO")
    weather_conditions: str = Field(..., description="Weather", example="Clear")
