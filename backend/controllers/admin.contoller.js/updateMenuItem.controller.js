import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Menu from "../../models/menu.model.js";
import Kitchen from "../../models/kitchen.model.js";
import uploadImage from "../../utils/uploadImage.utils.js";
import deleteImage from "../../utils/deleteImage.utils.js";

const updateMenuItem = asyncHandler(async (req, res) => {
  const { menuId } = req.params;
  const { name, description, category, price, vegetarian, preparationTime } =
    req.body;
  const menuItem = await Menu.findById(menuId);
  if (!menuItem) throw new ApiError(404, "menu doesnt exist");

  const kitchen = await Kitchen.findById(menuItem.kitchen);
  if (!kitchen) throw new ApiError(404, "kitchen not found");

  if (kitchen.owner.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "access denied.you are not the owner of this kitchen",
    );
  }

  const updatedItem = {};
  if (name) updatedItem.name = name;
  if (description) updatedItem.description = description;
  if (category) updatedItem.category = category;
  if (price) updatedItem.price = price;
  if (vegetarian) updatedItem.vegetarian = vegetarian;
  if (preparationTime) updatedItem.preparationTime = preparationTime;

  if (req.file) {
    if (menuItem.image?.public_id) {
      await deleteImage(menuItem.image.public_id);
    }
    const imageResult = await uploadImage(req.file.buffer, "menu");
    updatedItem.image = imageResult;
  }
  if (Object.keys(updatedItem).length === 0) {
    throw new ApiError(404, "not given field to update");
  }
  const updatedMenuItem = await Menu.findByIdAndUpdate(menuID, updatedItem, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ message: "menu updated", menuItem: updatedItem });
});

export default updateMenuItem;
