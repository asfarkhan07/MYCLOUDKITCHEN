import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "Token is not available" });
  }

  //bearer sdasdadas
  const tokenValue = token.split(" ")[1];

  try {
    const isVerified = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = isVerified;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "invalid Token" });
  }
};

export default verifyToken;
