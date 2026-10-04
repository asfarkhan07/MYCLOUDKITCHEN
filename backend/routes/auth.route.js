import LoginLimiter from "../config/rateLimit.config.js";
import express from "express";
import upload from "../config/multer.config.js";
import register from "../controllers/user.controller.js/register.controller.js";
import login from "../controllers/user.controller.js/login.controller.js";
import getProfile from "../controllers/user.controller.js/getProfile.controller.js";
import updateProfile from "../controllers/user.controller.js/updateProfile.controller.js";
import createKitchen from "../controllers/admin.contoller.js/createKitchen.controller.js";
import getKitchen from "../controllers/admin.contoller.js/getKitchen.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";

const authRoute = express.Router();

authRoute.post("/register", validateRegister, register);
authRoute.post("/login",LoginLimiter,validateLogin,login);

//protected Routes
authRoute.get("/profile",verifyToken,getProfile);
authRoute.put("/updateprofile",verifyToken,updateProfile);
authRoute.post("/createkitchen", verifyToken, upload.single("image"), createKitchen);
authRoute.get("/kitchens", verifyToken, getKitchen);

export default authRoute;

