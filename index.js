import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ErrorHandler from "./middleware/ErrorHandler.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Router & Middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "status 200 good" });
});

app.use(ErrorHandler.throwError);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB good"))
  .catch((err) => console.error("Erreur MongoDB :", err));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});