import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import User from "../../models/user.model.js";
import Kitchen from "../../models/kitchen.model.js";
import Order from "../../models/order.model.js";

const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalKitchens, totalOrders, statusAgg, revenueAgg] =
    await Promise.all([
      User.countDocuments(),
      Kitchen.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

  //normalise the statusAggregation into a plain ojbect
  const orderBystatus = statusAgg.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  const revenue = revenueAgg[0]?.total || 0;

  res
    .status(200)
    .json({ totalUsers, totalKitchens, totalOrders, orderBystatus, revenue });
});

export default getStats;
