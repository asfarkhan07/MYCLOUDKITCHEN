import dotenv from "dotenv";
import app from "./src/app.js";
import connectDb from "./config/db.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

//database connection
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
