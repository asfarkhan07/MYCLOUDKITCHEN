import AsyncHandler from "express-async-handler";
import Order from "../../models/order.model.js";

const getAdminOrders = AsyncHandler(async (req, res) => {
    const {userId} = req.params;
    const orders = await Order.find({ userId });

    if(!orders) {
        throw new Error("No orders found for this user");
    }

    res.json({ orders });
});

export default getAdminOrders;