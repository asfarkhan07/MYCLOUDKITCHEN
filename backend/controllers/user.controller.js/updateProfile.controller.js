import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import bcrypt from "bcryptjs";

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, email, password } = req.body;
  const updatedData = {};

  if (username) updatedData.username = username;
  if (email) updatedData.email = email;
  if (password) updatedData.password = await bcrypt.hash(password, 10);

  if (Object.keys(updatedData).length === 0) {
    throw new ApiError("400", "No field entered to Update");
  }
  const updateUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updateUser) {
    throw new ApiError("404", "User not found!");
  }
  res.status(200).json({
    message: "User updated successfully",
    user: updateUser,
  });
});

export default updateProfile;
