import express from "express";
import { getCargoMix, getCargoShare, getCargoTrend, getCommodityVolumes, getContainerTrafficTrend, getThroughputTrendByCargoAndYear, getTopCommodities } from "../controllers/cargoController.js";

const router = express.Router();

// GET cargo mix (with optional date filter)
router.get("/cargo-mix", getCargoMix);
router.get("/commodity-volumes", getCommodityVolumes);
router.get("/throughput-trend-cargo", getThroughputTrendByCargoAndYear);
router.get("/cargo-trend", getCargoTrend)
router.get("/get-top-commodities",getTopCommodities)
router.get("/container-traffic-trend", getContainerTrafficTrend)
router.get("/cargo-share", getCargoShare)

export default router;
