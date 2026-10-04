const validateOrder = (req, res, next) => {
  const { kitchenId, items, deliveryAddress, paymentMethod } = req.body;
  const errors = [];

  if (!kitchenId) {
    errors.push("KithcenId is required");
  }
  if (!items || !Array.isArray(items) || items.length == 0) {
    errors.push("At least one item is required");
  } else {
    items.forEach((item, index) => {
        if (!item.menuItem)
          errors.push(`Item ${index + 1}: menuItem Id is required`);
        if (!item.quantity || Number(item.quantity) < 1)
          errors.push(`Item ${index + 1}: quantity must be at least 1`);
    });
  }

  if (!deliveryAddress) {
    errors.push("Delivery Address is required");
  } else {
    const { street, city, state, zipCode, country, phoneNumber } = deliveryAddress;
    if (!street) errors.push("Street is required");
    if (!city) errors.push("City is required");
    if (!state) errors.push("State is required");
    if (!zipCode) errors.push("ZipCode is required");
    if (!country) errors.push("Country is required");
    if (!phoneNumber) errors.push("PhoneNumber is required");
  }
  const validPaymentMethods = ["cash_on_delivery", "razorpay"];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    errors.push(
      `Payment method must be one of ${validPaymentMethods.join(", ")}`,
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export { validateOrder };
