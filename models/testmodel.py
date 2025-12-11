import joblib
import pandas as pd
import os

print("=" * 70)
print(" LOADING ML MODELS FOR TESTING ")
print("=" * 70)

# Folder where .pkl files are located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Model file names
models = {
    "CETO (Offshore Support Ship)": "ceto_best_ml_model.pkl",
    "POSEIDON (Cargo Ship)": "poseidon_best_ml_model.pkl",
    "TRITON (Tanker Ship)": "triton_best_ml_model.pkl"
}

# Features (same as your model)
FEATURES = [
    "Ship_SpeedOverGround",
    "Environment_SeaFloorDepth",
    "Weather_Temperature2M",
    "Weather_OceanCurrentVelocity",
    "Weather_WindSpeed10M",
    "Weather_WaveHeight",
    "Weather_WavePeriod"
]

# Scenarios to test
SCENARIOS = {
    "Standby position, calm":        [1.0, 25.0, 17.0, 0.1, 4.0, 0.6, 3.5],
    "Transit low speed":             [4.0, 35.0, 16.0, 0.3, 7.0, 1.2, 4.5],
    "Normal operations":             [6.0, 45.0, 15.0, 0.5, 10.0, 1.8, 5.5],
    "Rough weather transit":         [8.0, 55.0, 14.0, 1.0, 16.0, 3.0, 7.5],
    "High speed, deep water":        [10.0, 70.0, 16.0, 0.7, 12.0, 2.2, 6.5],
}

# ----------------------------------------------------------------------

for model_name, filename in models.items():
    path = os.path.join(BASE_DIR, filename)

    print("\n" + "=" * 70)
    print(f" LOADING MODEL → {model_name}")
    print("=" * 70)

    if not os.path.exists(path):
        print(f"❌ Model NOT FOUND: {path}")
        continue

    # Load the ML model
    model = joblib.load(path)
    print("✅ Loaded successfully!")

    print(f"\nTESTING SCENARIOS FOR: {model_name}")
    print("-" * 70)
    print(f"{'Scenario':<40s} | Fuel (kg/s)")
    print("-" * 70)

    for scenario_name, vals in SCENARIOS.items():
        df = pd.DataFrame([vals], columns=FEATURES)
        pred = model.predict(df)[0]
        print(f"{scenario_name:<40s} | {pred:.4f}")

print("\n" + "=" * 70)
print(" ALL MODELS TESTED ✓")
print("=" * 70)
