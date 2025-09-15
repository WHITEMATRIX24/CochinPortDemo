import vessels from "../models/vesselModel.js";
import { format } from "date-fns";

export const getVesselTurnaroundTrend = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    let start = startDate ? new Date(startDate) : new Date("2020-01-01");
    let end = endDate ? new Date(endDate) : new Date();

    const matchFilter = {
      ATABerth: { $gte: start, $lte: end },
      ATDUnberth: { $ne: null },
    };

    const result = await vessels.aggregate([
      { $match: matchFilter },

      {
        $addFields: {
          turnaroundHours: {
            $divide: [{ $subtract: ["$ATDUnberth", "$ATABerth"] }, 1000 * 60 * 60],
          },
        },
      },

      {
        $facet: {
          cargoWise: [
            {
              $group: {
                _id: {
                  year: { $year: "$ATABerth" },
                  month: { $month: "$ATABerth" },
                  cargo: "$CargoType",
                },
                avgTAT: { $avg: "$turnaroundHours" },
              },
            },
          ],
          overall: [
            {
              $group: {
                _id: {
                  year: { $year: "$ATABerth" },
                  month: { $month: "$ATABerth" },
                },
                avgTAT: { $avg: "$turnaroundHours" },
              },
            },
          ],
        },
      },
    ]);
/*     console.log(result);
 */    

    if (!result || result[0].cargoWise.length === 0) {
      return res.json({ message: "No data available for selected period" });
    }

    const cargoWise = result[0].cargoWise;
    const overall = result[0].overall;

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Build dictionary from overall
    const overallMap = {};
    overall.forEach((item) => {
      const label = `${monthNames[item._id.month - 1]}-${item._id.year}`;
      overallMap[label] = Math.round(item.avgTAT);
    });

    // Build dictionary for cargo wise
    const groupedData = {};
    cargoWise.forEach((item) => {
      const label = `${monthNames[item._id.month - 1]}-${item._id.year}`;
      if (!groupedData[label]) {
        groupedData[label] = {
          month: label,
          break_bulk: 0,
          liquid_bulk: 0,
          dry_bulk_mechanical: 0,
          containerised: 0,
        };
      }

      const tat = Math.round(item.avgTAT);
      const key = item._id.cargo
        ? item._id.cargo.toLowerCase().replace(/\s+/g, "_")
        : "unknown";
      groupedData[label][key] = tat;
    });

    // Generate all months in range
    const generateMonthRange = (start, end) => {
      const months = [];
      let current = new Date(start.getFullYear(), start.getMonth(), 1);
      const last = new Date(end.getFullYear(), end.getMonth(), 1);
      while (current <= last) {
        months.push({
          year: current.getFullYear(),
          month: current.getMonth() + 1,
          label: `${monthNames[current.getMonth()]}-${current.getFullYear()}`,
        });
        current.setMonth(current.getMonth() + 1);
      }
      return months;
    };

    const allMonths = generateMonthRange(start, end);

    // Final result
    const final = allMonths.map((m) => {
      const entry = groupedData[m.label] || {
        month: m.label,
        break_bulk: 0,
        liquid_bulk: 0,
        dry_bulk_mechanical: 0,
        containerised: 0,
      };

      return {
        ...entry,
        overall: overallMap[m.label] || 0, // use DB-calculated overall
      };
    });

    res.json(final);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vessel turnaround trend", error });
  }
};



export const getIdleVsTRT = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Default range (if not passed)
    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result_vessels = await vessels.aggregate([
      {
        $match: {
          ATA: { $gte: start, $lte: end }, // filter by arrival date
        },
      },
      {
        $project: {
          vessel: "$VslID",
          idle: "$IdleHrs", // already in schema
          trt: {
            // TRT = (ATD - ATA) in hours
            $divide: [
              { $subtract: ["$ATD", "$ATA"] },
              1000 * 60 * 60, // convert ms → hours
            ],
          },
        },
      },
    ]);
/*     console.log(result_vessels);
 */    

    res.json(result_vessels);
  } catch (error) {
    console.error("Error fetching Idle vs TRT data:", error);
    res.status(500).json({ error: "Server error" });
  }
};



export const getNationalityStats = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const stats = await vessels.aggregate([
      {
        $match: {
          ATA: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            flag: "$FlagCountry",
            type: "$ForeignCoastal", // "Foreign" or "Coastal"
          },
          vesselCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.flag",
          types: {
            $push: {
              type: "$_id.type",
              count: "$vesselCount",
            },
          },
          total: { $sum: "$vesselCount" },
        },
      },
      {
        $sort: { total: -1 }, // Top countries first
      },
      {
        $limit: 10, // Top 10 flag countries
      },
    ]);

    // Transform into frontend-friendly format
    const formatted = stats.map((item) => {
      const coastal = item.types.find((t) => t.type === "C")?.count || 0;
      const foreign = item.types.find((t) => t.type === "F")?.count || 0;
      return {
        flag: item._id || "Unknown",
        Coastal: coastal,
        Foreign: foreign,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching nationality stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAvgOutputPerShipBerthDay = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    // Step 1: Aggregate per month
    const stats = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          ATDUnberth: { $ne: null },
        },
      },
      {
        $project: {
          MT: 1,
          MnthYear: 1,
          berthDays: {
            $divide: [
              { $subtract: ["$ATDUnberth", "$ATABerth"] },
              1000 * 60 * 60 * 24, // ms → days
            ],
          },
        },
      },
      {
        $group: {
          _id: "$MnthYear",
          totalCargo: { $sum: "$MT" },
          totalBerthDays: { $sum: "$berthDays" },
          vesselCount: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
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
      { $sort: { month: 1 } },
    ]);

    // Step 2: If no data at all → return []
    if (!stats || stats.length === 0) {
      return res.json([]);
    }

    // Step 3: Generate all months in range
    const allMonths = [];
    let cur = new Date(start);
    cur.setDate(1);

    while (cur <= end) {
      allMonths.push(format(cur, "MMM-yy")); // eg: Apr-24
      cur.setMonth(cur.getMonth() + 1);
    }

    // Step 4: Fill missing months with zeros
    const dataMap = new Map(stats.map((d) => [d.month, d]));
    const filled = allMonths.map((m) => {
      const entry = dataMap.get(m);
      return {
        month: m,
        avgOutput: entry ? entry.avgOutput : 0,
        vesselCount: entry ? entry.vesselCount : 0,
      };
    });

    res.json(filled);
  } catch (error) {
    console.error("Error fetching Avg Output/Ship Berth Day:", error);
    res.status(500).json({ error: "Server error" });
  }
};
