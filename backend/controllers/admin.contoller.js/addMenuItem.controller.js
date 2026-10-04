import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Menu from "../../models/menu.model.js";
import uploadImage from "../../utils/uploadImage.utils.js";

const addMenuItem = asyncHandler(async (req, res) => {
  const { name, description, category, price, vegetarian, availability, preparationTime } =
    req.body;
  if (
    !name?.trim() ||
    !category ||
    price === undefined ||
    price === "" ||
    !description?.trim() ||
    preparationTime === undefined ||
    preparationTime === ""
  ) {
    throw new ApiError(400, "Name, description, category, price, and preparation time are required");
  }

  const menuData = {
    name: name.trim(),
    description: description.trim(),
    category,
    price: Number(price),
    availability: availability === undefined ? true : availability === true || availability === "true",
    vegetarian: vegetarian === true || vegetarian === "true",
    preparationTime: Number(preparationTime),
    kitchen: req.kitchen._id,
  };
  if (req.file) {
    const imageResult = await uploadImage(req.file.buffer, "menu");
    menuData.image = imageResult;
  }

  const menuItem = await new Menu(menuData).save();
  res.status(201).json({ message: "Menu saved successfully", menuItem });
});

export default addMenuItem;
