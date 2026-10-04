import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    customer: req.user.id,
    $or: [
      { paymentMethod: "cash_on_delivery" },
      { paymentMethod: "razorpay", paymentStatus: "completed" },
    ],
  })
    .populate("kitchen", "name image")
    .populate("items.menuItem", "name price")
    .sort({ createdAt: -1 });
  if (!orders) throw new ApiError(404, "No orders exists");

  res.status(200).json({ message: "orders here!", orders });
});

export default getMyOrders;
