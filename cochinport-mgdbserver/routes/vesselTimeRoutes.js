import express from "express";
import { getAvgWaitingBeforeBerthTrend, getBerthCongestionHeatmap, getIdleVsCargoHandled, getPortVsNonPortTimeSplit, getProductiveVsNonProductiveTime, getTurnaroundVsCargoSize, getVesselTimeUtilizationBreakdown } from "../controllers/VesselTimeUtilizationController.js";

const router = express.Router();

// Register route
router.get("/time-utilization/breakdown", getVesselTimeUtilizationBreakdown);

router.get("/time-utilization/productive-vs-nonproductive", getProductiveVsNonProductiveTime);

router.get("/time-utilization/waiting-trend", getAvgWaitingBeforeBerthTrend);

router.get("/time-utilization/idle-vs-cargo", getIdleVsCargoHandled);

router.get("/time-utilization/port-vs-nonport", getPortVsNonPortTimeSplit);

router.get("/time-utilization/berth-congestion-heatmap", getBerthCongestionHeatmap);

router.get("/time-utilization/turnaround-vs-cargo",getTurnaroundVsCargoSize);

export default router;
