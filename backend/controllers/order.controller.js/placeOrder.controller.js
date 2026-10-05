import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";
import buildOrderData from "../../services/order.service.js";
import sendEmail from "../../utils/sendEmail.utils.js";

const placeOrder = asyncHandler(async (req, res) => {
  if (req.body.paymentMethod !== "cash_on_delivery") {
    throw new ApiError(400, "online orders must use the payment checkout");
  }

  const order = new Order(await buildOrderData(req.user.id, req.body));
  await order.save();
  sendEmail(
    req.user.email,
    "Order Placed Successfully at MyCloudKitchen",
    `<p>Your order with ID ${order._id} has been placed successfully. Thank you for choosing My Cloud Kitchen!</p>`,
  ).catch((emailError) => {
    console.error("Order placement email notification failed:", emailError.message);
  });

  res.status(200).json({
    message: "Order successfully placed",
    order,
  });
});

export default placeOrder;
