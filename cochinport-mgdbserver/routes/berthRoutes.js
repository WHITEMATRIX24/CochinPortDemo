import express from "express";
import { getBerthOccupancy, getBerths } from "../controllers/berthController.js";

const router = express.Router();

router.get("/berth-occupancy", getBerthOccupancy);

router.get("/berths", getBerths);

export default router;
