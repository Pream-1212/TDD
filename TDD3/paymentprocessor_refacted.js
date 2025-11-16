class PaymentProcessor {
  constructor(apiClient, config = {}) {
    this.apiClient = apiClient;

    this.currencyRate = config.currencyRate || 1.2;

    this.discountRules = {
      SUMMER20: (amount) => amount * 0.8,
      WELCOME10: (amount) => amount - 10,
    };
  }

  processPayment(amount, currency, userId, method, metadata, discount, fraud) {
    this._validatePaymentMethod(method, metadata);
    this._performFraudCheck(amount, userId, fraud);

    let finalAmount = this._applyDiscount(amount, discount);
    finalAmount = this._convertCurrency(finalAmount, currency);

    const transaction = this._buildTransaction(
      amount,
      finalAmount,
      currency,
      method,
      metadata,
      discount,
      userId,
      fraud
    );

    this._sendToApi(method, transaction);
    this._sendConfirmationEmail(userId, finalAmount, currency);
    this._logAnalytics(transaction);

    return transaction;
  }

  refundPayment(txId, userId, reason, amount, currency, metadata) {
    const refund = {
      transactionId: txId,
      userId,
      reason,
      amount,
      currency,
      metadata,
      date: new Date(),
    };

    refund.netAmount = this._applyRefundFee(amount);
    this.apiClient.post("/payments/refund", refund);
    return refund;
  }

  // Helpers 

  _validatePaymentMethod(method, metadata) {
    const validators = {
      credit_card: () =>
        metadata.cardNumber && metadata.expiry ? null : "Invalid card metadata",

      paypal: () => (metadata.paypalAccount ? null : "Invalid PayPal metadata"),
    };

    const error = validators[method]?.();
    if (error) throw new Error(error);
    if (!validators[method]) throw new Error("Unsupported payment method");
  }

  _performFraudCheck(amount, userId, level) {
    if (level <= 0) return;

    const fraudLogic = amount < 100 ? this._light : this._heavy;
    fraudLogic(userId, amount);
  }

  _light(userId, amount) {
    console.log(`Light fraud check for ${userId}`);
  }

  _heavy(userId, amount) {
    console.log(`Heavy fraud check for ${userId}`);
  }

  _applyDiscount(amount, code) {
    if (!code) return amount;
    return this.discountRules[code]?.(amount) || amount;
  }

  _convertCurrency(amount, currency) {
    return currency === "USD" ? amount : amount * this.currencyRate;
  }

  _buildTransaction(
    amount,
    finalAmount,
    currency,
    method,
    metadata,
    discount,
    userId,
    fraud
  ) {
    return {
      userId,
      originalAmount: amount,
      finalAmount,
      currency,
      paymentMethod: method,
      metadata,
      discountCode: discount,
      fraudChecked: fraud,
      timestamp: new Date().toISOString(),
    };
  }

  _sendToApi(method, transaction) {
    const routes = {
      credit_card: "/payments/credit",
      paypal: "/payments/paypal",
    };
    this.apiClient.post(routes[method], transaction);
  }

  _applyRefundFee(amount) {
    return amount - amount * 0.05;
  }

  _sendConfirmationEmail(userId, amount, currency) {
    console.log(`Email: Payment of ${amount} ${currency} for user ${userId}`);
  }

  _logAnalytics(data) {
    console.log("Analytics:", data);
  }
}

module.exports = PaymentProcessor;
