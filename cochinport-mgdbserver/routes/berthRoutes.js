import express from "express";
import { getBerthOccupancy, getBerths, getBerthVesselTimeline, getVessels } from "../controllers/berthController.js";

const router = express.Router();

router.get("/berth-occupancy", getBerthOccupancy);

router.get("/berths", getBerths);

router.get("/get-berth-data", getVessels);

router.get("/berths/:berthId/vessels", getBerthVesselTimeline)


export default router;
