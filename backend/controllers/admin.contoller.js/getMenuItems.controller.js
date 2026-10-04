import asyncHandler from "../../utils/asyncHandler.utils.js";
import Menu from "../../models/menu.model.js";

const getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await Menu.find({ kitchen: req.kitchen._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ count: menuItems.length, menuItems });
});

export default getMenuItems;
