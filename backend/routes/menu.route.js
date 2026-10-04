import express from "express";
import upload from "../config/multer.config.js";
import addMenuItem from "../controllers/admin.contoller.js/addMenuItem.controller.js";
import getMenuItems from "../controllers/admin.contoller.js/getMenuItems.controller.js";
import deleteMenuItem from "../controllers/admin.contoller.js/deleteMenuItem.controller.js";
import updateMenuItem from "../controllers/admin.contoller.js/updateMenuItem.controller.js";
import isKitchenOwner from "../middleware/isKitchenOwner.middle.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
import { validateMenuItem } from "../validators/menu.validator.js";

const menuRoute = express.Router();

//all menu management routes are protected
menuRoute.use(verifyToken);

//add a menu item to a kitchen the user owns
menuRoute.get("/:kitchenId", isKitchenOwner, getMenuItems);
menuRoute.post(
  "/:kitchenId",
  isKitchenOwner,
  upload.single("image"),
  validateMenuItem,
  addMenuItem,
);

//update / delete a specific menu item
menuRoute.put("/:menuId", upload.single("image"), updateMenuItem);
menuRoute.delete("/:menuId",deleteMenuItem);

export default menuRoute
