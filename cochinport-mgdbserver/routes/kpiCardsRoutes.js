import express from "express";
import { getKPIData } from "../controllers/kpiCardsController.js";

const router = express.Router();

router.get("/statistics/kpis", getKPIData);

export default router;
