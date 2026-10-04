import bcrypt from "bcryptjs";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import sendEmail from "../../utils/sendEmail.utils.js";

const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    throw new ApiError("404", "Enter all the fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError("403", "User doesnt exist,Please register first");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError("403", "Invalid password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login Successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });

  sendEmail(
    email,
    "You are Logged In,Welcome",
    "<p>You have successfully LOGGED IN to the My Cloud Kitchen App. Use it to manage your account and explore our services.Thankyou.</p>",
  ).catch((emailError) => {
    console.error("Login email notification failed:", emailError.message);
  });
});

export default login