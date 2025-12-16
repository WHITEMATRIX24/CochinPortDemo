import vessels from "../models/vesselModel.js";
import { format } from "date-fns";


export const getVesselTimeUtilizationBreakdown = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          TRT_Total: { $gt: 0 },
        },
      },
      {
        $addFields: {
          monthLabel: {
            $dateToString: { format: "%b-%Y", date: "$ATABerth" },
          },
          monthDate: {
            $dateFromParts: {
              year: { $year: "$ATABerth" },
              month: { $month: "$ATABerth" },
              day: 1,
            },
          },
          idlingTotal: {
            $add: ["$Idling_Port", "$Idling_NonPort"],
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$monthLabel",
            monthDate: "$monthDate",
          },
          PBD: { $avg: "$PBD_Total" },
          SNWB: { $avg: "$SNWB_Total" },
          SWB: { $avg: "$SWB_Total" },
          Shifting: { $avg: "$Shifting_Total" },
          Idling: { $avg: "$idlingTotal" },
          OM: { $avg: "$OMTime" },
          IM: { $avg: "$IMTime" },
        },
      },
      { $sort: { "_id.monthDate": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          PBD: { $round: [{ $divide: ["$PBD", 3600] }, 0] },
          SNWB: { $round: [{ $divide: ["$SNWB", 3600] }, 0] },
          SWB: { $round: [{ $divide: ["$SWB", 3600] }, 0] },
          Shifting: { $round: [{ $divide: ["$Shifting", 3600] }, 0] },
          Idling: { $round: [{ $divide: ["$Idling", 3600] }, 0] },
          OM: { $round: [{ $divide: ["$OM", 3600] }, 0] },
          IM: { $round: [{ $divide: ["$IM", 3600] }, 0] },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching time utilization breakdown:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getProductiveVsNonProductiveTime = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          TRT_Total: { $gt: 0 },
        },
      },
      {
        $project: {
          productive: {
            $subtract: [
              "$TRT_Total",
              {
                $add: [
                  "$PBD_Total",
                  "$SNWB_Total",
                  "$SWB_Total",
                  "$Shifting_Total",
                  "$Idling_Port",
                  "$Idling_NonPort",
                ],
              },
            ],
          },
          nonProductive: {
            $add: [
              "$PBD_Total",
              "$SNWB_Total",
              "$SWB_Total",
              "$Shifting_Total",
              "$Idling_Port",
              "$Idling_NonPort",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          productive: { $sum: "$productive" },
          nonProductive: { $sum: "$nonProductive" },
        },
      },
    ]);

    if (!result.length) {
      return res.json([]);
    }

    res.json([
      { name: "Productive Time", value: Math.round(result[0].productive / 3600) },
      { name: "Non-Productive Time", value: Math.round(result[0].nonProductive / 3600) },
    ]);
  } catch (error) {
    console.error("Error fetching productive vs non-productive time:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getAvgWaitingBeforeBerthTrend = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          monthLabel: {
            $dateToString: { format: "%b-%Y", date: "$ATABerth" },
          },
          monthDate: {
            $dateFromParts: {
              year: { $year: "$ATABerth" },
              month: { $month: "$ATABerth" },
              day: 1,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$monthLabel",
            monthDate: "$monthDate",
          },
          avgWaiting: {
            $avg: { $add: ["$PBD_Total", "$SNWB_Total"] },
          },
        },
      },
      { $sort: { "_id.monthDate": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          avgWaitingHours: {
            $round: [{ $divide: ["$avgWaiting", 3600] }, 0],
          },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching avg waiting time trend:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getIdleVsCargoHandled = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await vessels.aggregate([
      {
        $match: {
          ATA: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          vessel: "$VslID",
          cargo: "$MT",
          idle: {
            $add: ["$Idling_Port", "$Idling_NonPort"],
          },
        },
      },
    ]);

    const formatted = result.map((r) => ({
      vessel: r.vessel,
      cargo: r.cargo || 0,
      idleHours: Math.round((r.idle || 0) / 3600),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching Idle vs Cargo data:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getPortVsNonPortTimeSplit = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          monthLabel: {
            $dateToString: { format: "%b-%Y", date: "$ATABerth" },
          },
          monthDate: {
            $dateFromParts: {
              year: { $year: "$ATABerth" },
              month: { $month: "$ATABerth" },
              day: 1,
            },
          },
          portTime: {
            $add: [
              { $ifNull: ["$PBD_Port", 0] },
              { $ifNull: ["$SNWB_Port", 0] },
              { $ifNull: ["$SWB_Port", 0] },
              { $ifNull: ["$Idling_Port", 0] },
            ],
          },
          nonPortTime: {
            $add: [
              { $ifNull: ["$PBD_Non_Port", 0] },
              { $ifNull: ["$SNWB_NonPort", 0] },
              { $ifNull: ["$SWB_NonPort", 0] },
              { $ifNull: ["$Idling_NonPort", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$monthLabel",
            monthDate: "$monthDate",
          },
          avgPortTime: { $avg: "$portTime" },
          avgNonPortTime: { $avg: "$nonPortTime" },
        },
      },
      { $sort: { "_id.monthDate": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          Port: { $round: [{ $divide: ["$avgPortTime", 3600] }, 0] },
          NonPort: { $round: [{ $divide: ["$avgNonPortTime", 3600] }, 0] },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching Port vs Non-Port time split:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getBerthCongestionHeatmap = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          Berth: { $ne: null },
        },
      },
      {
        $addFields: {
          month: {
            $dateToString: {
              format: "%b-%Y",
              date: "$ATABerth",
            },
          },
          waitingTime: {
            $add: [
              { $ifNull: ["$PBD_Total", 0] },
              { $ifNull: ["$SNWB_Total", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            berth: "$Berth",
            month: "$month",
          },
          avgWaiting: { $avg: "$waitingTime" },
        },
      },
      {
        $project: {
          _id: 0,
          berth: "$_id.berth",
          month: "$_id.month",
          avgWaitingHours: {
            $round: [{ $divide: ["$avgWaiting", 3600] }, 1],
          },
        },
      },
      { $sort: { month: 1, berth: 1 } },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching berth congestion heatmap:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTurnaroundVsCargoSize = async (req, res) => {
  try {
    let { startDate, endDate, cargoUnit = "MT" } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const cargoField = cargoUnit === "TEU" ? "$Teus" : "$MT";

    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          TRT_Total: { $gt: 0 },
        },
      },
      {
        $project: {
          vessel: "$VslID",
          berth: "$Berth",
          cargo: { $ifNull: [cargoField, 0] },
          turnaroundHours: {
            $round: [{ $divide: ["$TRT_Total", 3600] }, 2],
          },
        },
      },
      {
        $match: {
          cargo: { $gt: 0 },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching turnaround vs cargo size:", error);
    res.status(500).json({ error: "Server error" });
  }
};




