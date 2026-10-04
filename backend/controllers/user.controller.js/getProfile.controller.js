import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new ApiError("404", "User doesnt exist");
  }
  res.status(200).json({ message: "User fetched", user });
});

export default getProfile;
