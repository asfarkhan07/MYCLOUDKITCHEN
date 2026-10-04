import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import User from "../../models/user.model.js";

//GET/api/admin/users (admin only)
//List all users without password hashes

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  throw new ApiError(403, "users not found");
  res.status(200).json({ count: users.length, users });
});

export default getUsers;
