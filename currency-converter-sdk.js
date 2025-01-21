class CurrencyConverterSDK {
  constructor() {
    this.containerId = null;
    this.onConversion = null; // Callback for sending converted value back to the client
    this.onRateChange = null; // Callback for sending exchange rate to the client
    this.onError = null; // Callback for sending error to the client
    this.data = {
      amount: 0,
      currency: "USD",
    }; // Default data
    this.exchangeRates = {
      USD: 0.012, // Example conversion rates from INR
      EUR: 0.011,
      GBP: 0.0099,
      JPY: 1.68,
      AUD: 0.019,
    };
  }

  /**
   * Initialize the SDK with options.
   * @param {Object} options - Configuration options.
   * @param {string} options.containerId - The ID of the container to render the button.
   * @param {Function} options.onConversion - Callback to handle the converted value.
   * @param {Function} options.onRateChange - Callback to handle exchange rate updates.
   */
  init({ containerId, onConversion, onRateChange, onError }) {
    this.containerId = containerId;
    this.onConversion = onConversion;
    this.onRateChange = onRateChange;
    this.onError = onError;

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

    // Clear the container
    container.innerHTML = "";

    // Create the button
    const button = document.createElement("button");
    button.textContent = `Convert to ${this.data.currency}`;
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "white";
    button.style.color = "#000";
    button.style.border = "2px solid black";
    button.style.borderRadius = "50px";
    button.style.cursor = "pointer";
    button.onclick = this.handleConvert.bind(this);

    container.appendChild(button);

    // Store the button reference for updates
    this.button = button;

    // Notify the client of the initial exchange rate
    this.notifyRateChange();
  }

  /**
   * Update SDK data dynamically (e.g., amount or currency).
   * @param {Object} newData - Updated data (e.g., { amount, currency }).
   */
  updateData(newData) {
    this.data = { ...this.data, ...newData };

    // Update button text based on selected currency
    if (this.button) {
      this.button.textContent = `Convert to ${this.data.currency}`;
    }

    // Notify the client of the updated exchange rate
    if (newData.currency) {
      this.notifyRateChange();
      this.handleConvert();
    }
  }

  /**
   * Notify the client of the current exchange rate.
   */
  notifyRateChange() {
    const { currency } = this.data;
    const rate = this.exchangeRates[currency];

    if (this.onRateChange && typeof this.onRateChange === "function") {
      this.onRateChange(rate);
    }
  }

  /**
   * Handle the conversion when the button is clicked.
   */
  handleConvert() {
    console.log('handle convert')
    const { amount, currency } = this.data;

    if (!amount || isNaN(amount)) {
      this.onError("Enter Amount");
      return;
    }
    this.onError("");

    // Perform the currency conversion
    const rate = this.exchangeRates[currency];
    if (!rate) {
      console.error(`No exchange rate found for currency "${currency}".`);
      return;
    }

    const convertedValue = (amount * rate).toFixed(2);

    // Send the converted value back to the client
    if (this.onConversion && typeof this.onConversion === "function") {
      this.onConversion(convertedValue);
    }
  }
}

// Export the SDK globally
window.CurrencyConverterSDK = new CurrencyConverterSDK();
