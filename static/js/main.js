const form = document.getElementById("prediction-form");
const button = document.getElementById("predict-button");
const errorBox = document.getElementById("form-error");
const resultPanel = document.getElementById("result-panel");
const resultValue = document.getElementById("result-value");
const resetButton = document.getElementById("reset-button");

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}
function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
}
function setLoading(loading) {
  button.disabled = loading;
  button.classList.toggle("loading", loading);
  button.querySelector(".button-label").textContent = loading ? "Calculating estimate..." : "Estimate property value";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();
  if (!form.reportValidity()) return;

  const payload = {
    house_size: Number(document.getElementById("house-size").value),
    bedrooms: Number(document.getElementById("bedrooms").value),
    bathrooms: Number(document.getElementById("bathrooms").value),
    floors: Number(document.getElementById("floors").value)
  };

  if (!Number.isFinite(payload.house_size) || payload.house_size <= 0) {
    showError("House size must be greater than zero.");
    return;
  }
  if ([payload.bedrooms, payload.bathrooms, payload.floors].some(v => !Number.isFinite(v) || v < 0)) {
    showError("Please enter valid, non-negative values for all home details.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to calculate the estimate.");
    const amount = new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 2
    }).format(result.prediction);
    resultValue.textContent = amount;
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    showError(error.message || "Could not connect to the prediction server. Is Flask running?");
  } finally {
    setLoading(false);
  }
});

resetButton.addEventListener("click", () => {
  resultPanel.hidden = true;
  document.getElementById("house-size").focus();
});
