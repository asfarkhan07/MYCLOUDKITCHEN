import express from "express";
import placeOrder from "../controllers/order.controller.js/placeOrder.controller.js";
import getOrderById from "../controllers/order.controller.js/getOrderById.controller.js";
import getMyOrders from "../controllers/order.controller.js/getMyOrders.controller.js";
import cancelOrder from "../controllers/order.controller.js/cancelOrder.controller.js";
import createRazorpayOrder from "../controllers/order.controller.js/createRazorpayOrder.controller.js";
import verifyRazorpayPayment from "../controllers/order.controller.js/verifyRazorpayPayment.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
import { validateOrder } from "../validators/order.validator.js";

const orderRoute = express.Router();

//protectedRoute
orderRoute.use(verifyToken);

orderRoute.post("/", validateOrder, placeOrder);
orderRoute.post("/razorpay/create", validateOrder, createRazorpayOrder);
orderRoute.post("/razorpay/verify", verifyRazorpayPayment);
orderRoute.get("/my", getMyOrders);
orderRoute.get("/:orderId", getOrderById);
orderRoute.patch("/:orderId/cancel", cancelOrder);

export default orderRoute;
