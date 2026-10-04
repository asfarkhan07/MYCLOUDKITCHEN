import express from "express";
import upload from "../config/multer.config.js";
import createKitchen from "../controllers/admin.contoller.js/createKitchen.controller.js";
import getKitchenOrders from "../controllers/admin.contoller.js/getKitchenOrders.controller.js";
import getKitchen from "../controllers/admin.contoller.js/getKitchen.controller.js";
import getOneKitchen from "../controllers/admin.contoller.js/getOneKitchen.controller.js";
import isKitchenOwner from "../middleware/isKitchenOwner.middle.js";
import verificationToken from "../middleware/verifyToken.middleware.js";

const kitchenRoute = express.Router();

//all kitchen Routes are protected
kitchenRoute.use(verificationToken);

kitchenRoute.post(
  "/createKitchen",
  upload.single("image"),
  createKitchen,
);
kitchenRoute.get("/Mykitchens", getKitchen);
kitchenRoute.get("/:kitchenId",isKitchenOwner,getOneKitchen);


//owner-only routes for a specific Kitchen
kitchenRoute.get("/:kitchenId/orders", isKitchenOwner, getKitchenOrders);

export default kitchenRoute;
