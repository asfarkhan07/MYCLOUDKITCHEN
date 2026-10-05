import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";
import Order from "../../models/order.model.js";

const getOrders = asyncHandler(async (req, res) => {
  const kitchens = await Kitchen.find({ owner: req.user.id }).select("_id");
  const kitchenIds = kitchens.map((kitchen) => kitchen._id);
  const orders = await Order.find({ kitchen: { $in: kitchenIds } })
    .populate("customer", "username email")
    .populate("kitchen", "name")
    .populate("items.menuItem", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ count: orders.length, orders });
});

export default getOrders;
