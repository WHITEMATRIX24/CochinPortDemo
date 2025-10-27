// controllers/vesselYoYController.js
import vessels from "../models/vesselModel.js";
import { format } from "date-fns";

// Helper function to compute duration in hours
const diffHours = (start, end) =>
  start && end ? (new Date(end) - new Date(start)) / (1000 * 60 * 60) : 0;

//return april months data
export const getVesselYoYKPIs = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    // Default: use current financial year (April–March) and previous year
    const now = new Date();
    let currentFY, previousFY;

    // If today is before April → we are still in last FY
    if (now.getMonth() + 1 < 4) {
      // Example: March 2025 → FY 2024–25 is still running
      currentFY = now.getFullYear() - 1; // FY start year
    } else {
      // Example: Aug 2025 → FY 2025–26 is running
      currentFY = now.getFullYear();
    }

    previousFY = currentFY - 1;

    // Financial year ranges
    const start1 = new Date(`${currentFY}-04-01T00:00:00Z`);
    const end1 = new Date(`${currentFY + 1}-03-31T23:59:59Z`);
    const start2 = new Date(`${previousFY}-04-01T00:00:00Z`);
    const end2 = new Date(`${previousFY + 1}-03-31T23:59:59Z`);


    const vesselsYear1 = await vessels.find({ ATABerth: { $gte: start1, $lte: end1 } });
    const vesselsYear2 = await vessels.find({ ATABerth: { $gte: start2, $lte: end2 } });

    // Core calculation function
    const calculateKPIs = (vessels) => {
      let totalMT = 0,
        dryMT = 0,
        liquidMT = 0,
        teus = 0,
        trtList = [],
        trtContainer = [],
        berthHours = 0,
        idleHours = 0,
        totalPBDSeconds = 0,
        pbdCount = 0;

      vessels.forEach((v) => {
        totalMT += v.MT || 0;
        teus += v.Teus || 0;

        // Cargo split
        if (v.CargoType === "Dry Bulk Mechanical") dryMT += v.MT || 0;
        if (v.CargoType === "Liquid Bulk") liquidMT += v.MT || 0;

        // Turnaround time (hrs)
        const trt = diffHours(v.ATA, v.ATD);
        if (trt > 0) {
          trtList.push(trt);
          if (v.CargoType === "Containerised") trtContainer.push(trt);
        }

        // Berth hrs
        const bh = diffHours(v.ATABerth, v.ATDUnberth);
        berthHours += bh;

        // Idle hrs
        idleHours += v.IdleHrs || 0;

        // Pre-berthing detention from PBD_Total
        if (v.PBD_Total != null) {
          totalPBDSeconds += v.PBD_Total;
          pbdCount += 1;
        }
      });

      // Mean TRT
      const meanTRT =
        trtList.length > 0 ? trtList.reduce((a, b) => a + b, 0) / trtList.length : 0;

      // Median TRT
      const medianTRT = (() => {
        if (trtList.length === 0) return 0;
        const sorted = [...trtList].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      })();

      // Container TRT
      const avgContainerTRT =
        trtContainer.length > 0
          ? trtContainer.reduce((a, b) => a + b, 0) / trtContainer.length
          : 0;

      // Output per Ship Berth Day
      const outputPerBerthDay =
        berthHours > 0 ? (totalMT / berthHours) * 24 : 0;

      // Avg Pre-berthing detention in hours
      const avgPBD = pbdCount > 0 ? totalPBDSeconds / pbdCount / 3600 : 0;

      // Idle %
      const idlePercent = berthHours > 0 ? (idleHours / berthHours) * 100 : 0;

      return {
        totalThroughputMMT: totalMT / 1_000_000,
        dryCargoMMT: dryMT / 1_000_000,
        liquidCargoMMT: liquidMT / 1_000_000,
        containerTEUs: teus,
        meanTRT,
        medianTRT,
        avgContainerTRT,
        outputPerBerthDay,
        avgPBD,
        idlePercent,
      };
    };

    const year1Vals = calculateKPIs(vesselsYear1);
    const year2Vals = calculateKPIs(vesselsYear2);

    // Variation % helper
    const variation = (c, d) =>
      c && c !== 0 ? ((d - c) / c) * 100 : null;

    const variationVals = {};
    Object.keys(year1Vals).forEach((key) => {
      variationVals[key] = variation(year1Vals[key], year2Vals[key]);
    });

    res.json({
      year1: year1Vals,
      year2: year2Vals,
      variation: variationVals,
    });
  } catch (err) {
    console.error("Error computing YoY vessel KPIs:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// controllers/throughputController.js
//dashboard/yoy/throughput
export const getThroughputVariance = async (req, res) => {
  try {
    const { startDate, endDate, mode } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const currentYear = start.getFullYear();
    const previousYear = currentYear - 1;

    let data = [];

    // Helper: cargo type filter
    const getTotals = async (startDate, endDate) => {
      const [total, dry, liquid, container] = await Promise.all([
        vessels.aggregate([
          { $match: { ATABerth: { $gte: startDate, $lte: endDate } } },
          { $group: { _id: null, val: { $sum: "$MT" } } },
        ]),
        vessels.aggregate([
          { $match: { ATABerth: { $gte: startDate, $lte: endDate }, CargoType: "Dry Bulk Mechanical" } },
          { $group: { _id: null, val: { $sum: "$MT" } } },
        ]),
        vessels.aggregate([
          { $match: { ATABerth: { $gte: startDate, $lte: endDate }, CargoType: "Liquid Bulk" } },
          { $group: { _id: null, val: { $sum: "$MT" } } },
        ]),
        vessels.aggregate([
          { $match: { ATABerth: { $gte: startDate, $lte: endDate }, CargoType: "Containerised" } },
          { $group: { _id: null, val: { $sum: "$Teus" } } },
        ]),
      ]);

      return {
        totalThroughput: (total[0]?.val || 0) / 1_000_000,
        dryCargo: (dry[0]?.val || 0) / 1_000_000,
        liquidCargo: (liquid[0]?.val || 0) / 1_000_000,
        containerTEUs: container[0]?.val || 0,
      };
    };

    if (mode === "month") {
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();

  for (let m = startMonth; m <= endMonth; m++) {
    const startCur = new Date(currentYear, m, 1);
    const endCur = new Date(currentYear, m + 1, 0, 23, 59, 59);

    const startPrev = new Date(previousYear, m, 1);
    const endPrev = new Date(previousYear, m + 1, 0, 23, 59, 59);

    const cur = await getTotals(startCur, endCur);
    const prev = await getTotals(startPrev, endPrev);

    data.push({
      month: new Date(currentYear, m, 1).toLocaleString("default", { month: "short" }),
      current: cur,
      previous: prev,
      variance: {
        totalThroughput:
          prev.totalThroughput > 0
            ? ((cur.totalThroughput - prev.totalThroughput) / prev.totalThroughput) * 100
            : null,
        dryCargo:
          prev.dryCargo > 0 ? ((cur.dryCargo - prev.dryCargo) / prev.dryCargo) * 100 : null,
        liquidCargo:
          prev.liquidCargo > 0 ? ((cur.liquidCargo - prev.liquidCargo) / prev.liquidCargo) * 100 : null,
        containerTEUs:
          prev.containerTEUs > 0
            ? ((cur.containerTEUs - prev.containerTEUs) / prev.containerTEUs) * 100
            : null,
      },
    });
  }
}
 else if (mode === "year") {
      const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear];

      for (let y of years) {
        const startY = new Date(y, 0, 1);
        const endY = new Date(y, 11, 31, 23, 59, 59);

        const totals = await getTotals(startY, endY);

        data.push({
          year: y,
          ...totals,
        });
      }

      // Add variance YoY (for all cargo types)
      data = data.map((d, i) => {
        if (i === 0) return { ...d, variance: {} };
        const prev = data[i - 1];
        return {
          ...d,
          variance: {
            totalThroughput:
              prev.totalThroughput > 0
                ? ((d.totalThroughput - prev.totalThroughput) / prev.totalThroughput) * 100
                : null,
            dryCargo:
              prev.dryCargo > 0 ? ((d.dryCargo - prev.dryCargo) / prev.dryCargo) * 100 : null,
            liquidCargo:
              prev.liquidCargo > 0 ? ((d.liquidCargo - prev.liquidCargo) / prev.liquidCargo) * 100 : null,
            containerTEUs:
              prev.containerTEUs > 0
                ? ((d.containerTEUs - prev.containerTEUs) / prev.containerTEUs) * 100
                : null,
          },
        };
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching throughput variance:", err);
    res.status(500).json({ error: "Server error" });
  }
};


//dashboard/yoy/turnaround trend

export const getVesselTurnaroundTrendYoy = async (req, res) => {
  try {
    const { startDate, endDate, mode } = req.query;

    const now = new Date();
    const baseYear = startDate ? new Date(startDate).getFullYear() : now.getFullYear();

    let pipeline;
    if (mode === "year") {
      // Last 5 years
      const fromYear = baseYear - 4;
      const fromDate = new Date(fromYear, 0, 1);
      const toDate = new Date(baseYear, 11, 31, 23, 59, 59);

      pipeline = [
        {
          $match: {
            ATA: { $gte: fromDate, $lte: toDate },
            ATD: { $exists: true },
          },
        },
        {
          $addFields: {
            turnAroundHours: {
              $divide: [{ $subtract: ["$ATD", "$ATA"] }, 1000 * 60 * 60],
            },
          },
        },
        {
          $group: {
            _id: { year: { $year: "$ATA" } },
            meanOverall: { $avg: "$turnAroundHours" },
            containerAvg: {
              $avg: {
                $cond: [
                  { $eq: ["$CargoType", "Containerised"] }, // ✅ fix field name
                  "$turnAroundHours",
                  null,
                ],
              },
            },
            allTurnAround: { $push: "$turnAroundHours" },
          },
        },
        { $sort: { "_id.year": 1 } },
      ];

      const results = await vessels.aggregate(pipeline);

      // Build 5-year dataset with zeros for missing years
      const years = Array.from({ length: 5 }, (_, i) => fromYear + i);
      const formatted = years.map((y) => {
        const r = results.find((row) => row._id.year === y);

        let median = 0;
        if (r?.allTurnAround?.length > 0) {
          const arr = r.allTurnAround.sort((a, b) => a - b);
          const mid = Math.floor(arr.length / 2);
          median = arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
        }

        return {
          year: y,
          meanOverall: r?.meanOverall || 0,
          medianOverall: median || 0,
          containerAvg: r?.containerAvg || 0,
        };
      });

      return res.json(formatted);
    }

    // Monthwise (existing logic)
    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    pipeline = [
      {
        $match: {
          ATA: { $gte: start, $lte: end },
          ATD: { $exists: true },
        },
      },
      {
        $addFields: {
          turnAroundHours: {
            $divide: [{ $subtract: ["$ATD", "$ATA"] }, 1000 * 60 * 60],
          },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$ATA" }, month: { $month: "$ATA" } },
          meanOverall: { $avg: "$turnAroundHours" },
          containerAvg: {
            $avg: {
              $cond: [
                { $eq: ["$CargoType", "Containerised"] },
                "$turnAroundHours",
                null,
              ],
            },
          },
          allTurnAround: { $push: "$turnAroundHours" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const results = await vessels.aggregate(pipeline);

    const formatted = results.map((r) => {
      let median = 0;
      if (r.allTurnAround?.length > 0) {
        const arr = r.allTurnAround.sort((a, b) => a - b);
        const mid = Math.floor(arr.length / 2);
        median = arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
      }

      
      return {
        year: r._id.year,
        month: r._id.month,
        meanOverall: r.meanOverall,
        medianOverall: median,
        containerAvg: r.containerAvg,
      };
    });

/*     console.log(formatted);
 */    
    res.json(formatted);
  } catch (err) {
    console.error("Error in vessel turnaround controller:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// controllers/idleTimeController.js

export const getIdleTimeAtBerthYoy = async (req, res) => {
  try {
    let { startDate, endDate, mode } = req.query;

    let start, end;

    if (mode === "year") {
      // Force last 5 years range
      const currentYear = new Date().getFullYear();
      start = new Date(currentYear - 4, 0, 1);
      end = new Date(currentYear, 11, 31);
    } else {
      // Use requested range or fallback
      start = startDate ? new Date(startDate) : new Date("2020-01-01");
      end = endDate ? new Date(endDate) : new Date();
    }

    const matchFilter = {
      ATA: { $gte: start, $lte: end },
      ATD: { $ne: null },
      IdleHrs: { $ne: null },
    };

    let groupStage;
    if (mode === "year") {
      groupStage = {
        _id: { year: { $year: "$ATA" } },
        totalIdle: { $sum: "$IdleHrs" },
        totalTime: { $sum: { $divide: [{ $subtract: ["$ATD", "$ATA"] }, 3600000] } }, // hrs
      };
    } else {
      groupStage = {
        _id: { year: { $year: "$ATA" }, month: { $month: "$ATA" } },
        totalIdle: { $sum: "$IdleHrs" },
        totalTime: { $sum: { $divide: [{ $subtract: ["$ATD", "$ATA"] }, 3600000] } },
      };
    }

    let result = await vessels.aggregate([
      { $match: matchFilter },
      { $group: groupStage },
      {
        $project: {
          year: "$_id.year",
          month: mode === "month" ? "$_id.month" : null,
          idlePercent: {
            $cond: [
              { $gt: ["$totalTime", 0] },
              { $multiply: [{ $divide: ["$totalIdle", "$totalTime"] }, 100] },
              0,
            ],
          },
          totalIdle: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    // 🔹 Ensure continuous data for last 5 years
    if (mode === "year") {
      const currentYear = new Date().getFullYear();
      const lastFiveYears = [];
      for (let y = currentYear - 4; y <= currentYear; y++) {
        const found = result.find((r) => r.year === y);
        lastFiveYears.push(found || { year: y, idlePercent: 0, totalIdle: 0 });
      }
      result = lastFiveYears;
    }

/*     console.log(result);
 */    
    res.json(result);

  } catch (error) {
    console.error("Error in getIdleTime:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAvgOutputPerShipBerthDayYoy = async (req, res) => {
  try {
    let { startDate, endDate, mode } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    // 🔹 Adjust $match differently for month vs year
    let matchStage = {
      ATABerth: { $gte: start, $lte: end },
      ATDUnberth: { $ne: null },
    };

    if (mode === "year") {
      const endYear = end.getFullYear();
      const startYear = endYear - 4; // last 5 years
      matchStage.ATABerth = {
        $gte: new Date(startYear, 0, 1),
        $lte: new Date(endYear, 11, 31, 23, 59, 59),
      };
    }

    const groupStage =
      mode === "year"
        ? {
            _id: { year: { $year: "$ATABerth" } },
            totalCargo: { $sum: "$MT" },
            totalBerthDays: { $sum: "$berthDays" },
            vesselCount: { $sum: 1 },
          }
        : {
            _id: {
              year: { $year: "$ATABerth" },
              month: { $month: "$ATABerth" },
            },
            totalCargo: { $sum: "$MT" },
            totalBerthDays: { $sum: "$berthDays" },
            vesselCount: { $sum: 1 },
          };

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          MT: 1,
          ATABerth: 1,
          ATDUnberth: 1,
          berthDays: {
            $divide: [
              { $subtract: ["$ATDUnberth", "$ATABerth"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      { $group: groupStage },
      {
        $project: {
          year: "$_id.year",
          month: mode === "month" ? "$_id.month" : undefined,
          avgOutput: {
            $cond: [
              { $eq: ["$totalBerthDays", 0] },
              0,
              { $divide: ["$totalCargo", "$totalBerthDays"] },
            ],
          },
          vesselCount: 1,
        },
      },
    ];

    if (mode === "month") {
      pipeline.push({ $sort: { year: 1, month: 1 } });
    } else {
      pipeline.push({ $sort: { year: 1 } });
    }

    const stats = await vessels.aggregate(pipeline);

    if (mode === "month") {
      // 🔹 Monthwise → generate from start to end
      const allMonths = [];
      let cur = new Date(start);
      cur.setDate(1);
      while (cur <= end) {
        allMonths.push(format(cur, "MMM-yy"));
        cur.setMonth(cur.getMonth() + 1);
      }

      const dataMap = new Map(
        stats.map((d) => [
          format(new Date(d.year, d.month - 1), "MMM-yy"),
          d,
        ])
      );

      const filled = allMonths.map((m) => {
        const entry = dataMap.get(m);
        return {
          month: m,
          avgOutput: entry ? entry.avgOutput : 0,
          vesselCount: entry ? entry.vesselCount : 0,
        };
      });

      return res.json(filled);
    } else {
      // 🔹 Yearwise → always last 5 years from endDate
      const endYear = end.getFullYear();
      const allYears = [];
      for (let y = endYear - 4; y <= endYear; y++) {
        allYears.push(y);
      }

      const dataMap = new Map(stats.map((d) => [d.year, d]));
      const filled = allYears.map((y) => {
        const entry = dataMap.get(y);
        return {
          year: y,
          avgOutput: entry ? entry.avgOutput : 0,
          vesselCount: entry ? entry.vesselCount : 0,
        };
      });

      return res.json(filled);
    }
  } catch (error) {
    console.error("Error fetching Avg Output/Ship Berth Day:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getPBDData = async (req, res) => {
  try {
    const { startDate, endDate, mode } = req.query;

    if (!startDate || !endDate)
      return res.status(400).json({ error: "Provide startDate and endDate" });

    const start = new Date(startDate);
    const end = new Date(endDate);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    if (mode === "year") {
      // ✅ Always take last 5 full years based on `endDate`
      const endYear = end.getFullYear();
      const years = [endYear - 4, endYear - 3, endYear - 2, endYear - 1, endYear];

      const pipeline = [
        {
          $match: {
            ATABerth: {
              $gte: new Date(endYear - 4, 0, 1),
              $lte: new Date(endYear, 11, 31, 23, 59, 59),
            },
            PBD_Total: { $ne: null },
          },
        },
        {
          $project: {
            year: { $year: "$ATABerth" },
            PBD_Hours: { $divide: ["$PBD_Total", 3600] }, // convert seconds → hours
          },
        },
        {
          $group: {
            _id: "$year",
            avgPBD: { $avg: "$PBD_Hours" },
            vesselsCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];

      const result = await vessels.aggregate(pipeline);

      // 🔹 Fill missing years with 0
      const data = years.map((y) => {
        const found = result.find((r) => r._id === y);
        return {
          year: y,
          avgPBD: found ? found.avgPBD : 0,
          vesselsCount: found ? found.vesselsCount : 0,
        };
      });

      return res.json(data);
    }

    // 🔹 Monthwise → respect frontend startDate/endDate
    const pipeline = [
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          PBD_Total: { $ne: null },
        },
      },
      {
        $project: {
          year: { $year: "$ATABerth" },
          month: { $month: "$ATABerth" },
          PBD_Hours: { $divide: ["$PBD_Total", 3600] },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          avgPBD: { $avg: "$PBD_Hours" },
          vesselsCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const result = await vessels.aggregate(pipeline);

    // 🔹 Fill missing months
    const allMonths = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;

      const found = result.find(
        (r) => r._id.year === year && r._id.month === month
      );

      allMonths.push({
        month: monthNames[month - 1],
        year,
        avgPBD: found ? found.avgPBD : 0,
        vesselsCount: found ? found.vesselsCount : 0,
      });

      current.setMonth(current.getMonth() + 1);
    }

    res.json(allMonths);
  } catch (err) {
    console.error("Error fetching PBD data:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// pages/api/y-o-y/berth-occupancy.js
export const getBerthOccupancyData = async (req, res) => {
  try {
    const { startDate, endDate, mode } = req.query;

    if (!startDate || !endDate)
      return res.status(400).json({ error: "Provide startDate and endDate" });

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Assuming total berths in port, used to calculate max possible hours
    const TOTAL_BERTHS = 21; // adjust as per your port

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    if (mode === "year") {
      const endYear = end.getFullYear();
      const startYear = endYear - 4;
      const startOfPeriod = new Date(startYear, 0, 1);
      const endOfPeriod = new Date(endYear, 11, 31, 23, 59, 59);

      const pipeline = [
        {
          $match: {
            ATABerth: { $gte: startOfPeriod, $lte: endOfPeriod },
            ATDUnberth: { $ne: null },
          },
        },
        {
          $project: {
            year: { $year: "$ATABerth" },
            berthHours: { $divide: [{ $subtract: ["$ATDUnberth", "$ATABerth"] }, 1000 * 60 * 60] },
          },
        },
        {
          $group: {
            _id: "$year",
            totalBerthHoursUsed: { $sum: "$berthHours" },
            vesselsCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];

      const result = await vessels.aggregate(pipeline);

      const data = [];
      for (let y = startYear; y <= endYear; y++) {
        const found = result.find(r => r._id === y);
        const totalHours = TOTAL_BERTHS * 24 * (y % 4 === 0 ? 366 : 365); // adjust for leap year
        data.push({
          year: y,
          occupancyHours: found ? found.totalBerthHoursUsed : 0,
          occupancyPercent: found ? (found.totalBerthHoursUsed / totalHours) * 100 : 0,
          vesselsCount: found ? found.vesselsCount : 0,
        });
      }
      console.log(data);
      

      return res.json(data);
    }

    // Monthwise
    const pipeline = [
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          ATDUnberth: { $ne: null },
        },
      },
      {
        $project: {
          year: { $year: "$ATABerth" },
          month: { $month: "$ATABerth" },
          berthHours: { $divide: [{ $subtract: ["$ATDUnberth", "$ATABerth"] }, 1000 * 60 * 60] },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalBerthHoursUsed: { $sum: "$berthHours" },
          vesselsCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const result = await vessels.aggregate(pipeline);

    // Fill missing months
    const allMonths= [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      const found = result.find(r => r._id.year === year && r._id.month === month);
      const daysInMonth = new Date(year, month, 0).getDate();
      const totalHours = TOTAL_BERTHS * 24 * daysInMonth;

      allMonths.push({
        month: monthNames[month - 1],
        year,
        occupancyHours: found ? found.totalBerthHoursUsed : 0,
        occupancyPercent: found ? (found.totalBerthHoursUsed / totalHours) * 100 : 0,
        vesselsCount: found ? found.vesselsCount : 0,
      });

      current.setMonth(current.getMonth() + 1);
    }

    res.json(allMonths);
  } catch (err) {
    console.error("Error fetching berth occupancy data:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const getCommodityCodes = async (req, res) => {
  try {
    const { kpi, startDate, endDate } = req.query;

    if (!kpi || typeof kpi !== "string") {
      return res.status(400).json({ error: "KPI parameter is required" });
    }
    if (!startDate || !endDate || typeof startDate !== "string" || typeof endDate !== "string") {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    console.log(kpi);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full end day

    let cargoType;
    let valueField;

    if (kpi === "Liquid Cargo (MMT)") {
      cargoType = "Liquid Bulk";
      valueField = "$MT";
    } else if (kpi === "Containers (TEUs)") {
      cargoType = "Containerised";
      valueField = "$Teus";
    } else {
      return res.status(400).json({ error: "Invalid KPI" });
    }

    // Aggregate commodity totals
    const pipeline = [
      {
        $match: {
          CargoType: cargoType,
          ATABerth: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$Commodity",
          total: { $sum: valueField },
        },
      },
      {
        $project: {
          _id: 0,
          code: "$_id",
          value: "$total",
        },
      },
      { $sort: { value: -1 } },
    ];

    const result = await vessels.aggregate(pipeline);

    console.log(result);
    
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching commodity codes:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
  }
};

export default getCommodityCodes;




