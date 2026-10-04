import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Kitchen from "../../models/kitchen.model.js";

const getAllKitchen = asyncHandler(async (req, res) => {
  const owner = req.user.id;
  const kitchens = await Kitchen.find({ owner }).sort({ createdAt: -1 });

  if (!kitchens || kitchens.length === 0) {
    throw new ApiError("404", "You dont have a kitchen");
  }

  res.status(200).json({ message: "Kitchen fetched successfully", kitchens });
});

export default getAllKitchen;
