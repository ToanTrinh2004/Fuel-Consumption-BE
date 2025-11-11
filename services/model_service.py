import joblib
import pandas as pd
from typing import Dict, Any

class ModelService:
    # Map ship type -> model file
    SHIP_MODEL_MAP = {
        "CETO": "models/ceto_best_ml_model.pkl",
        "POSEIDON": "models/poseidon_best_ml_model.pkl",
        "TRITON": "models/triton_best_ml_model.pkl",
    }

    def __init__(self):
        self.model = None
        self.current_ship_type = None

    # Load đúng model theo ship_type
    def load_model_for_ship(self, ship_type: str):
        st = ship_type.upper()
        if st not in self.SHIP_MODEL_MAP:
            raise ValueError(f"Unknown ship type: {st}")
        path = self.SHIP_MODEL_MAP[st]
        self.model = joblib.load(path)
        self.current_ship_type = st

    # Chuẩn hóa features theo model
    def prepare_features(self, params: Dict[str, Any]) -> pd.DataFrame:
        features = {
            "Ship_SpeedOverGround": params["Ship_SpeedOverGround"],
            "Environment_SeaFloorDepth": params["Environment_SeaFloorDepth"],
            "Weather_Temperature2M": params["Weather_Temperature2M"],
            "Weather_OceanCurrentVelocity": params["Weather_OceanCurrentVelocity"],
            "Weather_WindSpeed10M": params["Weather_WindSpeed10M"],
            "Weather_WaveHeight": params["Weather_WaveHeight"],
            "Weather_WavePeriod": params["Weather_WavePeriod"],
        }
        df = pd.DataFrame([features])

        # Align với feature_names_in_
        model_features = getattr(self.model, "feature_names_in_", None)
        if model_features is not None:
            df = df.reindex(columns=model_features, fill_value=0)

        return df

    # Predict
    def predict(self, params: Dict[str, Any]) -> float:
        st = params["ship_type"].upper()
        if st != self.current_ship_type:
            self.load_model_for_ship(st)

        X = self.prepare_features(params)
        pred = self.model.predict(X)
        return float(pred[0])


model_service = ModelService()
