import express from "express";
import getCommodityCodes, { getAvgOutputPerShipBerthDayYoy, getBerthOccupancyData, getIdleTimeAtBerthYoy, getOperationalTimeComposition, getPBDData, getThroughputVariance, getVesselTurnaroundTrendYoy, getVesselYoYKPIs } from "../controllers/y-o-yController.js";

const router = express.Router();

// Register route
router.get("/kpi", getVesselYoYKPIs);

router.get("/throughput-variance", getThroughputVariance)

router.get("/turnaround-trend-yoy", getVesselTurnaroundTrendYoy)

router.get("/idle-time-yoy", getIdleTimeAtBerthYoy)

router.get("/avg-output-yoy", getAvgOutputPerShipBerthDayYoy)

router.get("/pbd-data-yoy", getPBDData)

router.get("/berth-occupancy-yoy", getBerthOccupancyData)

router.get("/commodity-codes", getCommodityCodes)

router.get("/operational-time-data", getOperationalTimeComposition)

export default router;
