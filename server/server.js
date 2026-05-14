
import dotenv from "dotenv";
dotenv.config();
console.log("SERVER STARTING...");

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

console.log("ENV TEST:", process.env.MONGODB_URI);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Tune Fox API running on port " + PORT);
  });
});