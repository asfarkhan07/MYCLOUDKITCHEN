import express from "express";
import authRoute from "../routes/auth.route.js";
import adminRoute from "../routes/admin.route.js";
import browseRoute from "../routes/browse.route.js";
import orderRoute from "../routes/order.route.js";
import errorHandler from "../middleware/error.middle.js";

const app = express();

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