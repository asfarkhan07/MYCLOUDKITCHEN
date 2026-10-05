import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";

const getAllKitchen = asyncHandler(async (req, res) => {
  const owner = req.user.id;
  const kitchens = await Kitchen.find({ owner }).sort({ createdAt: -1 });

  res.status(200).json({ message: "Kitchen fetched successfully", kitchens });
});

export default getAllKitchen;
