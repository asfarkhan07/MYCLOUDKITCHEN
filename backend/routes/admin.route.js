import express from "express";
import deleteOrder from "../controllers/admin.contoller.js/deleteOrder.controller.js";
import getAllOrders from "../controllers/admin.contoller.js/getAllOrders.controller.js";
import getAllUsers from "../controllers/admin.contoller.js/getAllUsers.controller.js";
import getStats from "../controllers/admin.contoller.js/getStats.controller.js";
import updateOrder from "../controllers/admin.contoller.js/updateOrder.controller.js";
import isAdmin from "../middleware/isAdmin.middle.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
import kitchenRoute from "./kitchen.route.js";
import menuRoute from "./menu.route.js";

const adminRoute = express.Router();

const adminOnly = [verifyToken, isAdmin];

adminRoute.get("/stats", adminOnly, getStats);
adminRoute.get("/users", adminOnly, getAllUsers);
adminRoute.get("/orders", adminOnly, getAllOrders);
adminRoute.patch("/orders/:orderId", adminOnly, updateOrder);
adminRoute.delete("/orders/:orderId", adminOnly, deleteOrder);

//aggregates the kitchen and menu management APIs
//each sub routers applies its own verification of token and
//ownership checks (isKitchenOwner), so no extra guard here

adminRoute.use("/kitchens",kitchenRoute);
adminRoute.use("/menu",menuRoute);

export default adminRoute;
