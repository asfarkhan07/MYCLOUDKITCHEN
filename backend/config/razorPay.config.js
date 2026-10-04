import Razorpay from "razorpay";
import ApiError from "../utils/ApiError.utils.js";

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new ApiError(503, "Online payments are not configured");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export default getRazorpayClient;