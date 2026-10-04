import express from "express";
import getAllKitchen from "../controllers/public.controller.js/getAllKitchens.controller.js";
import getKitchenMenu from "../controllers/public.controller.js/getKitchenMenu.controller.js";

const browseRoute=express.Router();

browseRoute.get("/kitchens",getAllKitchen);
browseRoute.get("/kitchens/:kitchenId/menu",getKitchenMenu);

export default browseRoute