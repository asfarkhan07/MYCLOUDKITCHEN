import User from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../utils/sendEmail.utils.js";

const registerUser = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const role = req.body.role?.trim() || "user";
  const allowedRoles = ["user", "admin", "moderator"];

  if (!username || !email || !password)
    throw new ApiError(400, "all fields are required!");

  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "invalid role provided");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser?.email === email) {
    throw new ApiError(409, "user already exists");
  }
  if (existingUser) {
    throw new ApiError(409, "username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      throw new ApiError(
        409,
        duplicateField === "username"
          ? "username already exists"
          : "user already exists",
      );
    }
    throw error;
  }
  res.status(201).json({ message: "User registered successfully", user });

  sendEmail(
    email,
    "Welcome to My Cloud Kitchen",
    "<p>You have successfully registered for the My Cloud Kitchen App. Use it to manage your account and explore our services. Thank you!</p>",
  ).catch((emailError) => {
    console.error("Registration email notification failed:", emailError.message);
  });
});

export default registerUser;
