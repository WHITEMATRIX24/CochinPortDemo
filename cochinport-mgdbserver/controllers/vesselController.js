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

    const stats = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end },
          ATDUnberth: { $ne: null },
          MT: { $gt: 0 },
        },
      },
      {
        $addFields: {
          monthDate: {
            $dateFromParts: {
              year: { $year: "$ATABerth" },
              month: { $month: "$ATABerth" },
              day: 1,
            },
          },
          berthDays: {
            $divide: [
              { $subtract: ["$ATDUnberth", "$ATABerth"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$monthDate",
          totalCargo: { $sum: "$MT" },
          totalBerthDays: { $sum: "$berthDays" },
          vesselCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          monthDate: "$_id",
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
      { $sort: { monthDate: 1 } },
    ]);

    // Build a map using ISO month key
    const dataMap = new Map(
      stats.map((d) => [
        format(d.monthDate, "MMM-yy"),
        d,
      ])
    );

    // Generate full month range
    const filled = [];
    let cur = new Date(start);
    cur.setDate(1);

    while (cur <= end) {
      const label = format(cur, "MMM-yy");
      const entry = dataMap.get(label);

      filled.push({
        month: label,
        avgOutput: entry ? Math.round(entry.avgOutput) : 0,
        vesselCount: entry ? entry.vesselCount : 0,
      });

      cur.setMonth(cur.getMonth() + 1);
    }

    res.json(filled);
  } catch (error) {
    console.error("Error fetching Avg Output/Ship Berth Day:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getVesselsFormatted = async (req, res) => {
  try {
    let {
      startDate,
      endDate,
      VslID,
      vesselId,
      cargoType,
      year,
      page = 1,
      limit = 10,
    } = req.query;

    const vesselIdValue = vesselId || VslID;

    // Pagination
    page = parseInt(page, 10);
    limit = limit === "all" ? 0 : parseInt(limit, 10);

    const filter = {};

    // 🔑 Apply vessel ID filter FIRST (no date restriction)
    if (vesselIdValue) {
  filter.VslID = {
    $regex: vesselIdValue.trim(),
    $options: "i", // case-insensitive
  };
}

     else {
      // Date filter only when vesselId is NOT provided
      let start, end;

      if (year) {
        const y = parseInt(year, 10);
        start = new Date(`${y}-01-01T00:00:00Z`);
        end = new Date(`${y}-12-31T23:59:59Z`);
      } else {
        start = startDate ? new Date(startDate) : new Date("2020-01-01");
        end = endDate ? new Date(endDate) : new Date();
      }

      filter.ATA = { $gte: start, $lte: end };
    }

    if (cargoType) filter.CargoType = cargoType;

    const totalDocs = await vessels.countDocuments(filter);

    let query = vessels.find(filter).sort({ ATA: -1 });
    if (limit > 0) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const vesselDocs = await query;

    const formatted = vesselDocs.map((v) => ({
      vesselId: v.VslID,
      name: v.VslID,
      berthNumber: v.Berth,
      arrivalDate: v.ATA ? v.ATA.toISOString().split("T")[0] : null,
      departureDate: v.ATD ? v.ATD.toISOString().split("T")[0] : null,
      cargoType: v.CargoType,
      country: v.FlagCountry,
      grossTonnage: v.GRT,
      commodity: v.Commodity,
      foreignCoastal: v.ForeignCoastal,
    }));

    res.json({
      data: formatted,
      pagination: {
        totalDocs,
        page,
        limit: limit === 0 ? "all" : limit,
        totalPages: limit === 0 ? 1 : Math.ceil(totalDocs / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vessels:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllVessels =async(req,res)=>{
  try {
    const vessel = await vessels.find({});
    res.json(vessel);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vessels" });
  }
}

