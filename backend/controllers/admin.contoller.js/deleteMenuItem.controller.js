import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";
import deleteImage from "../../utils/deleteImage.utils.js";

const deleteMenuItem = asyncHandler(async (req, res) => {
  const { menuId } = req.params;

  const menuItem = await Menu.findById(menuId);
  if (!menuItem) throw new ApiError(404, "Menu doesnt exist");

  const kitchen = await Kitchen.findById(menuItem.kitchen);
  if (!kitchen) throw new ApiError(404, "Kitchen not found");

  if (kitchen.owner.toString() !== req.user.id) {
    throw new ApiError(403, "access denied.you dont own this kitchen");
  }

  if (menuItem.image?.public_id) {
    await deleteImage(menuItem.image.public_id);
  }
  await menuItem.deleteOne();
  res.status(200).json({ message: "Menu successfully deleted" });
});

export default deleteMenuItem;
