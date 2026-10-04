import { randomUUID, createHmac } from "node:crypto";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import getRazorpayClient from "../../config/razorpay.config.js";
import buildOrderData from "../../services/order.service.js";

const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (req.body.paymentMethod !== "razorpay") {
    throw new ApiError(400, "paymentMethod must be razorpay");
  }

  const orderData = await buildOrderData(req.user.id, {
    ...req.body,
    paymentMethod: "razorpay",
  });
  const razorpay = getRazorpayClient();
  const receipt = randomUUID();
  const checkoutPayload = Buffer.from(
    JSON.stringify({
      customerId: String(req.user.id),
      receipt,
      orderData,
    }),
  ).toString("base64url");
  const checkoutSignature = createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET,
  )
    .update(checkoutPayload)
    .digest("base64url");
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(orderData.totalAmount * 100),
    currency: "INR",
    receipt,
    notes: { customerId: String(req.user.id) },
  });

  res.status(201).json({
    razorpayOrderId: razorpayOrder.id,
    checkoutToken: `${checkoutPayload}.${checkoutSignature}`,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

export default createRazorpayOrder;