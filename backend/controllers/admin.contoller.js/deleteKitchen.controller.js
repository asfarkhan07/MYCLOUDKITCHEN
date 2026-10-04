import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";
import deleteImage from "../../utils/deleteImage.utils.js";

const deleteKitchen = asyncHandler(async (req, res) => {
  const kitchenId = req.params;
  const kitchen = await Kitchen.findById({ kitchenId });
  if (!kitchen) throw new ApiError(404, "kitchen doesnt exist");

  const menuItem = await Menu.findById(kitchenId);
  if (!menuItem.image.public_id) {
    await kitchen.deleteOne();
    res.status(200).json({ message: "kitchen successfully deleted" });
  } else {
    await deleteImage(menuItem.image.public_id);
    await kitchen.deleteOne();
    res.status(200).json({ message: "kitchen successfully deleted" });
  }
});

export default deleteKitchen;
