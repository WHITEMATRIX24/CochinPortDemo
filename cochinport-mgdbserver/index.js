// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, MongoDB + Express is running 🚀");
});

// Import userRoutes routes
import userRoutes from "./routes/userRoutes.js";
app.use("/api/auth", userRoutes);

import cargoRoutes from "./routes/cargoRoutes.js";
app.use("/api/cargo", cargoRoutes);

import berthRoutes from "./routes/berthRoutes.js";
app.use("/api/berthData", berthRoutes);

import vesselRoutes from "./routes/vesselRoutes.js";
app.use("/api/vessel", vesselRoutes);

import kpiRoutes from "./routes/kpiCardsRoutes.js";
app.use("/api", kpiRoutes);

import  yoyRoutes from "./routes/y-o-yRoutes.js";
app.use("/api/y-o-y", yoyRoutes);

import vesselTime from "./routes/vesselTimeRoutes.js"
app.use("/api/vessels", vesselTime)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
