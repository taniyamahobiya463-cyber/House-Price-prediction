# House-Price-prediction
House Price Prediction using Machine Learning
# HomeValue — House Price Prediction UI

A responsive HTML/CSS/JavaScript frontend connected to a Flask API and your supplied `linear_model.pkl` Linear Regression model.

## Input features
The API sends the four values to the model in this exact order:
1. `House Size (sqft)`
2. `Number of Bedrooms`
3. `Number of Bathrooms`
4. `Number of Floors`

The model predicts `Price`.

## Project structure
```text
house_price_prediction_ui/
├── app.py
├── linear_model.pkl
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── css/style.css
    └── js/main.js
```

## Run locally (Windows)
1. Extract the ZIP file.
2. Open the extracted project folder in VS Code.
3. Open Terminal in that folder.
4. Create a virtual environment (recommended):
   ```bash
   py -m venv .venv
   .venv\Scripts\activate
   ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Start Flask:
   ```bash
   python app.py
   ```
7. Open **http://127.0.0.1:5000** in your browser.

## API
`POST /api/predict`

JSON request:
```json
{
  "house_size": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "floors": 2
}
```

Successful response:
```json
{
  "prediction": 1234567.0,
  "currency": "₹"
}
```
The numeric value above is an example response format, not a prediction from your model.

## Notes
- The frontend validates inputs and displays errors returned by Flask.
- The model artifact is loaded locally by Flask; it is not sent to the browser.
- The UI formats the result as INR (₹). Confirm your training dataset's `Price` unit before interpreting the amount.
- Pickle files should only be loaded from trusted sources. The supplied model was load-tested in the current environment; scikit-learn emitted a version compatibility warning because it was saved with a different version. If predictions behave unexpectedly, recreate the pickle using the same scikit-learn version used during training.
- This is a demo estimate, not a verified property valuation.
