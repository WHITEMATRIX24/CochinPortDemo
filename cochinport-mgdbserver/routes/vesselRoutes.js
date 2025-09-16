import express from "express";
import {getAvgOutputPerShipBerthDay, getIdleVsTRT, getNationalityStats, getVesselsFormatted, getVesselTurnaroundTrend  } from "../controllers/vesselController.js";

const router = express.Router();
router.get("/vessel-turnaround-time", getVesselTurnaroundTrend)

router.get("/idle-vs-trt", getIdleVsTRT);

router.get("/nationality-stats", getNationalityStats);

router.get("/avg-output", getAvgOutputPerShipBerthDay)

router.get("/ship-visits", getVesselsFormatted)
export default router;
