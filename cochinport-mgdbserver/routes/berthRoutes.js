import express from "express";
import { getBerthOccupancy, getBerths, getVessels } from "../controllers/berthController.js";

const router = express.Router();

router.get("/berth-occupancy", getBerthOccupancy);

router.get("/berths", getBerths);

router.get("/get-berth-data", getVessels);


export default router;
