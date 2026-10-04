import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { cancellationReason } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "order not found");

  if (order.customer.toString() !== req.user.id) {
    throw new ApiError(404, "access denied.this is not your order");
  }
  if (order.orderStatus === "cancelled") {
    throw new ApiError(404, "order is already cancelled");
  }
  if (
    order.orderStatus === "out_for_delivery" ||
    order.orderStatus === "delivered"
  ) {
    throw new ApiError(404, "order cant be cancelled now");
  }
  order.orderStatus = "cancelled";
  order.cancellationReason = cancellationReason || "cancelled by user";

  if (order.paymentStatus === "completed") {
    order.paymentStatus = "refunded";
  }
  await order.save();

  res.status(200).json({ message: "order successfully deleted", order });
});

export default cancelOrder;
