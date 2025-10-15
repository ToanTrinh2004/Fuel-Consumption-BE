import joblib
import pandas as pd
from typing import Dict, Any

class ModelService:
    # Initialize the model service
    def __init__(self, model_path: str = "models/fuel_consumption_predict.pkl"):
        self.model = None
        self.model_path = model_path
        self.load_model()
    # load the model from the specified path (in models folder)
    def load_model(self):
        """Load the trained LightGBM model"""
        try:
            self.model = joblib.load(self.model_path)
            print(f" Model loaded successfully from {self.model_path}")
        except Exception as e:
            print(f" Failed to load model: {e}")
            raise
    # prepare features for prediction
    def prepare_features(self, params: Dict[str, Any]) -> pd.DataFrame:
        features = {
            # Numeric
            'distance': params['distance'],
            'engine_efficiency': params['engine_efficiency'],

            'ship_type_Oil Service Boat': 1 if params['ship_type'] == 'Oil Service Boat' else 0,
            'ship_type_Surfer Boat': 1 if params['ship_type'] == 'Surfer Boat' else 0,
            'ship_type_Tanker Ship': 1 if params['ship_type'] == 'Tanker Ship' else 0,

            'route_id_Lagos-Apapa': 1 if params['route_id'] == 'Lagos-Apapa' else 0,
            'route_id_Port Harcourt-Lagos': 1 if params['route_id'] == 'Port Harcourt-Lagos' else 0,
            'route_id_Warri-Bonny': 1 if params['route_id'] == 'Warri-Bonny' else 0,


            'month_Jan': 1 if params['month'] == 1 else 0,
            'month_Feb': 1 if params['month'] == 2 else 0,
            'month_Mar': 1 if params['month'] == 3 else 0,
            'month_May': 1 if params['month'] == 5 else 0,
            'month_Jun': 1 if params['month'] == 6 else 0,
            'month_Jul': 1 if params['month'] == 7 else 0,
            'month_Aug': 1 if params['month'] == 8 else 0,
            'month_Sep': 1 if params['month'] == 9 else 0,
            'month_Oct': 1 if params['month'] == 10 else 0,
            'month_Nov': 1 if params['month'] == 11 else 0,
            'month_Dec': 1 if params['month'] == 12 else 0,

            'fuel_type_HFO': 1 if params['fuel_type'] == 'HFO' else 0,
            'weather_conditions_Moderate': 1 if params['weather_conditions'] == 'Moderate' else 0,
            'weather_conditions_Stormy': 1 if params['weather_conditions'] == 'Stormy' else 0,
        }

        tmp_mapping = {
                'ship_type_Oil Service Boat': 'ship_type_Oil_Service_Boat',
                'ship_type_Surfer Boat': 'ship_type_Surfer_Boat',
                'ship_type_Tanker Ship': 'ship_type_Tanker_Ship',
                'route_id_Port Harcourt-Lagos': 'route_id_Port_Harcourt-Lagos'
            }
        X = pd.DataFrame([features])
        model_features = getattr(self.model, "feature_names_in_", None)
        if model_features is not None:
            X = X.reindex(columns=model_features, fill_value=0)

        reverse_mapping = {v: k for k, v in tmp_mapping.items()}
        X = X.rename(columns=reverse_mapping)
        

        


        return X


    # make prediction using the model
    def predict(self, params: Dict[str, Any]) -> float:
        """
        Make fuel consumption prediction
        
        Returns:
            float: Predicted fuel consumption
        """
        try:
            
            X = self.prepare_features(params)
            print(X.T)
            prediction = self.model.predict(X)
        
            return float(prediction[0])
        except Exception as e:
            print(f" Prediction error: {e}")
            raise

# Singleton instance
model_service = ModelService()