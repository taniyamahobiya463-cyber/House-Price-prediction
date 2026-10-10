from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle
from pathlib import Path

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "linear_model.pkl"

with MODEL_PATH.open("rb") as f:
    model = pickle.load(f)

FEATURES = [
    "House Size (sqft)",
    "Number of Bedrooms",
    "Number of Bathrooms",
    "Number of Floors",
]

@app.get("/")
def home():
    return render_template("index.html")

@app.post("/api/predict")
def predict():
    data = request.get_json(silent=True) or {}
    try:
        values = [
            float(data["house_size"]),
            float(data["bedrooms"]),
            float(data["bathrooms"]),
            float(data["floors"]),
        ]
        if not all(np.isfinite(v) for v in values):
            raise ValueError("Please enter valid finite numbers.")
        if values[0] <= 0 or any(v < 0 for v in values[1:]):
            raise ValueError("House size must be greater than 0 and other values cannot be negative.")
        prediction = float(model.predict(np.array([values], dtype=float))[0])
        return jsonify({"prediction": prediction, "currency": "₹"})
    except (KeyError, TypeError, ValueError) as exc:
        return jsonify({"error": str(exc) or "Please enter valid values for all fields."}), 400
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({"error": "Prediction failed. Check that the model file matches the four input features."}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
