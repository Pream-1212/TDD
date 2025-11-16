const PaymentProcessor = require("./paymentprocessor"); // original
const RefactoredProcessor = require("./paymentprocessor_refacted"); // refactored

describe("PaymentProcessor", () => {
  let apiClient;
  let processor;

  beforeEach(() => {
    apiClient = {
      post: jest.fn(),
    };
    processor = new PaymentProcessor(apiClient);
  });

  test("throws error for invalid credit card metadata", () => {
    expect(() =>
      processor.processPayment(
        50,
        "USD",
        "user1",
        "credit_card",
        {}, // invalid metadata
        null,
        1
      )
    ).toThrow("Invalid card metadata");
  });

  test("throws error for invalid PayPal metadata", () => {
    expect(() =>
      processor.processPayment(
        50,
        "USD",
        "user1",
        "paypal",
        {}, // missing paypalAccount
        null,
        1
      )
    ).toThrow("Invalid PayPal metadata");
  });

  test("applies SUMMER20 discount correctly", () => {
    const result = processor.processPayment(
      100,
      "USD",
      "u1",
      "credit_card",
      { cardNumber: "123", expiry: "12/25" },
      "SUMMER20",
      0
    );
    expect(result.finalAmount).toBe(80);
  });

  test("applies WELCOME10 discount correctly", () => {
    const result = processor.processPayment(
      100,
      "USD",
      "u1",
      "credit_card",
      { cardNumber: "123", expiry: "12/25" },
      "WELCOME10",
      0
    );
    expect(result.finalAmount).toBe(90);
  });

  test("converts currency when not USD", () => {
    const result = processor.processPayment(
      100,
      "EUR",
      "u1",
      "credit_card",
      { cardNumber: "123", expiry: "12/25" },
      null,
      0
    );
    expect(result.finalAmount).toBe(100 * processor.currencyConversionRate);
  });

  test("sends credit card payments to the correct API endpoint", () => {
    processor.processPayment(
      100,
      "USD",
      "u1",
      "credit_card",
      { cardNumber: "123", expiry: "12/25" },
      null,
      0
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      "/payments/credit",
      expect.any(Object)
    );
  });

  test("sends paypal payments to the correct API endpoint", () => {
    processor.processPayment(
      100,
      "USD",
      "u1",
      "paypal",
      { paypalAccount: "abc@gmail.com" },
      null,
      0
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      "/payments/paypal",
      expect.any(Object)
    );
  });

  test("refund applies 5% refund fee", () => {
    const result = processor.refundPayment(
      "tx123",
      "user1",
      "duplicate",
      100,
      "USD",
      {}
    );

    expect(result.netAmount).toBe(95);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/payments/refund",
      expect.any(Object)
    );
  });
});
