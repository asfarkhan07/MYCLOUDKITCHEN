import express from "express";
import authRoute from "../routes/auth.route.js";
import adminRoute from "../routes/admin.route.js";
import browseRoute from "../routes/browse.route.js";
import orderRoute from "../routes/order.route.js";
import errorHandler from "../middleware/error.middle.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (
        process.env.FRONTEND_URL || "http://localhost:5173"
      )
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      callback(null, !origin || allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/browse", browseRoute);
app.use("/api/orders", orderRoute);

//Error handler
app.use(errorHandler)

// API is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Cloud Kitchen API is running" });
});

export default app;