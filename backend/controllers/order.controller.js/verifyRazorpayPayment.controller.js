import { createHmac, timingSafeEqual } from "node:crypto";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import getRazorpayClient from "../../config/razorPay.config.js";
import Order from "../../models/order.model.js";
import sendEmail from "../../utils/sendEmail.utils.js";

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    checkoutToken,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;
  if (!checkoutToken || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "payment verification details are required");
  }

  const [encodedPayload, encodedCheckoutSignature, extraPart] = checkoutToken.split(".");
  if (!encodedPayload || !encodedCheckoutSignature || extraPart) {
    throw new ApiError(400, "checkout token is invalid");
  }

  const razorpay = getRazorpayClient();
  const expectedCheckoutSignature = createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET,
  )
    .update(encodedPayload)
    .digest();
  const receivedCheckoutSignature = Buffer.from(
    encodedCheckoutSignature,
    "base64url",
  );
  if (
    expectedCheckoutSignature.length !== receivedCheckoutSignature.length ||
    !timingSafeEqual(expectedCheckoutSignature, receivedCheckoutSignature)
  ) {
    throw new ApiError(400, "checkout token signature is invalid");
  }

  let checkout;
  try {
    checkout = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    throw new ApiError(400, "checkout token is invalid");
  }
  if (checkout.customerId !== String(req.user.id)) {
    throw new ApiError(403, "checkout belongs to another customer");
  }

  const amount = Math.round(checkout.orderData.totalAmount * 100);
  const gatewayOrder = await razorpay.orders.fetch(razorpayOrderId);
  if (
    gatewayOrder.receipt !== checkout.receipt ||
    gatewayOrder.notes?.customerId !== String(req.user.id) ||
    gatewayOrder.amount !== amount ||
    gatewayOrder.currency !== "INR"
  ) {
    throw new ApiError(400, "payment order does not match this checkout");
  }

  const expectedSignature = createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET,
  )
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(razorpaySignature, "hex");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    throw new ApiError(400, "payment signature is invalid");
  }

  let payment = await razorpay.payments.fetch(razorpayPaymentId);
  if (
    payment.order_id !== razorpayOrderId ||
    payment.amount !== amount
  ) {
    throw new ApiError(400, "payment does not match this order");
  }
  if (payment.status === "authorized") {
    payment = await razorpay.payments.capture(
      razorpayPaymentId,
      payment.amount,
      payment.currency,
    );
  }
  if (payment.status !== "captured") {
    throw new ApiError(400, "payment is not captured for this order");
  }

  let order = await Order.findOne({ razorpayOrderId });
  if (order && order.customer.toString() !== String(req.user.id)) {
    throw new ApiError(403, "order belongs to another customer");
  }
  if (order?.paymentStatus === "completed") {
    return res.status(200).json({ message: "Payment already verified", order });
  }

  order ||= new Order({ ...checkout.orderData, razorpayOrderId });
  order.razorpayPaymentId = razorpayPaymentId;
  order.paymentStatus = "completed";
  order.orderStatus = "confirmed";
  try {
    await order.save();
  } catch (error) {
    if (error.code !== 11000) throw error;
    order = await Order.findOne({ razorpayOrderId, customer: req.user.id });
    if (!order) throw error;
  }

  sendEmail(
    req.user.email,
    "Order Placed Successfully at MyCloudKitchen",
    `<p>Your order with ID ${order._id} has been placed successfully. Thank you for choosing My Cloud Kitchen!</p>`,
  ).catch((emailError) => {
    console.error("Order placement email notification failed:", emailError.message);
  });

  res.status(200).json({ message: "Payment verified", order });
});

export default verifyRazorpayPayment;