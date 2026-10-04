import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("customer", "username email")
    .populate("kitchen", "name")
    .populate("items.menuItem", "name")
    .sort({ createdAt: -1 });

  if (!orders) throw new ApiError(404, "orders not found");
  res.status(200).json({ count: orders.length, orders });
});

export default getOrders;
