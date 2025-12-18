import vessels from "../models/vesselModel.js";

// Get cargo mix (pie chart data) with optional date filter
export const getCargoMix = async (req, res) => {
    
  try {
    const { startDate, endDate } = req.query;
/*     console.log(startDate,endDate);
 */
    // Build the match filter
    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.ATABerth = {}; // assuming you want to filter by ETA
      if (startDate) matchFilter.ATABerth.$gte = new Date(startDate);
      if (endDate) matchFilter.ATABerth.$lte = new Date(endDate);
    }

    const pipeline = [];

    // Add match stage if filter exists
    if (Object.keys(matchFilter).length) {
      pipeline.push({ $match: matchFilter });
    }

    // Group by cargo type
    pipeline.push(
      {
        $group: {
          _id: "$CargoType",
          totalVolume: { $sum: "$MT" },
        },
      },
      {
        $project: {
          _id: 0,
          cargoType: "$_id",
          totalVolume: 1,
        },
      }
    );

    const result = await vessels.aggregate(pipeline);

/*     console.log(result);
 */    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cargo mix", error });
  }
};


// Get total volume per cargo type for bar chart
export const getCommodityVolumes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.ATABerth = {};
      if (startDate) matchFilter.ATABerth.$gte = new Date(startDate);
      if (endDate) matchFilter.ATABerth.$lte = new Date(endDate);
    }

    // Ignore documents with null/empty cargo type
    matchFilter.CargoType = { $nin: [null, ""] };

    const result = await vessels.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$Commodity",
          totalVolume: { $sum: "$MT" },
        },
      },
      {
        $project: {
          _id: 0,
          cargoType: "$_id",
          totalVolume: 1,
        },
      },
      { $sort: { totalVolume: -1 } }, // optional: largest first
    ]);

    res.json(result);
        
  } catch (error) {
    res.status(500).json({ message: "Error fetching commodity volumes", error });
  }
};



// controller for dashboard/statisticalDashboard -> Throughput Trend by Cargo Type

export const getThroughputTrendByCargoAndYear = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Match only current range
    const matchFilter = {
      ATABerth: { $gte: start, $lte: end }
    };

    const result = await vessels.aggregate([
      { $match: matchFilter },

      // Compute month-year and dateKey
      {
        $addFields: {
          monthYear: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"
                  ],
                  { $subtract: [{ $month: "$ATABerth" }, 1] }
                ]
              },
              "-",
              { $toString: { $year: "$ATABerth" } }
            ]
          },
          dateKey: {
            $dateFromParts: {
              year: { $year: "$ATABerth" },
              month: { $month: "$ATABerth" },
              day: 1
            }
          }
        }
      },

      // Group by month + cargo
      {
        $group: {
          _id: {
            month: "$monthYear",
            dateKey: "$dateKey",
            cargo: { $ifNull: ["$CargoType", "Unknown"] }
          },
          totalThroughput: { $sum: { $ifNull: ["$MT", 0] } }
        }
      },

      { $sort: { "_id.dateKey": 1 } }
    ]);

    // Generate complete month range between start and end
    const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const months = [];
const cursor = new Date(start);

// Normalize to first day of month
cursor.setDate(1);
cursor.setHours(0, 0, 0, 0);

const endCursor = new Date(end);
endCursor.setDate(1);
endCursor.setHours(0, 0, 0, 0);

while (cursor <= endCursor) {
  months.push({
    month: `${MONTHS[cursor.getMonth()]}-${cursor.getFullYear()}`,
    dateKey: new Date(cursor),
  });

  cursor.setMonth(cursor.getMonth() + 1);
}


    // Reshape to chart data
    const chartDataMap = {};
    result.forEach(item => {
      const month = item._id.month;
      const cargo = item._id.cargo;
      if (!chartDataMap[month]) chartDataMap[month] = { month };
      chartDataMap[month][cargo] = item.totalThroughput;
    });
    // 🚩 Check if aggregation returned any real data
if (result.length === 0) {
  return res.json({
    message: "No data",
    data: [],
  });
}

    // Fill missing months with zero
    const cargos = new Set();
    result.forEach(item => cargos.add(item._id.cargo));

    const chartData = months.map(m => {
      const row = chartDataMap[m.month] || { month: m.month };
      cargos.forEach(c => {
        if (!row[c]) row[c] = 0;
      });
      return row;
    });

    if (chartData.length === 0) chartData.push({ month: "No Data" });

    console.log(chartData);
    
    res.json({
  message: "Success",
  data: chartData,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching throughput trend",
      error: error.message,
    });
  }
};

// controller for dashboard/cargoperformance -> trend of cargo volumes
export const getCargoTrend = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Step 1: Aggregate data
    const result = await vessels.aggregate([
      {
        $match: {
          ATABerth: { $gte: start, $lte: end }
        }
      },
      {
        $addFields: {
          monthYear: {
            $concat: [
              {
                $arrayElemAt: [
                  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                  { $subtract: [{ $month: "$ATABerth" }, 1] }
                ]
              },
              "-",
              { $toString: { $year: "$ATABerth" } }
            ]
          }
        }
      },
      {
        $group: {
          _id: { month: "$monthYear", cargo: { $ifNull: ["$CargoType", "Unknown"] } },
          totalVolume: { $sum: { $ifNull: ["$MT", 0] } }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // Step 2: Normalize results
    const chartDataMap = {};
    const cargoTypes = new Set();

    result.forEach(item => {
      const month = item._id.month;
      const cargo = item._id.cargo;
      cargoTypes.add(cargo);

      if (!chartDataMap[month]) chartDataMap[month] = { month };
      chartDataMap[month][cargo] = item.totalVolume;
    });

    // Step 3: Generate full month-year list between start & end
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const fullTimeline = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const label = `${months[cursor.getMonth()]}-${cursor.getFullYear()}`;
      fullTimeline.push(label);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    // Step 4: Build final dataset with dynamic cargo types
    const chartData = fullTimeline.map(m => {
      const row = { month: m };
      cargoTypes.forEach(cargo => {
        row[cargo] = chartDataMap[m]?.[cargo] || 0;
      });
      return row;
    });
/*     console.log(chartData);
 */    

    const allZero = chartData.every(item => {
  return Object.keys(item).every(key => key === "month" || item[key] === 0);
});

res.json({ 
  cargoTypes: Array.from(cargoTypes), 
  data: chartData, 
  allZero 
});
  } catch (error) {
    console.error("Error fetching cargo trend:", error);
    res.status(500).json({ message: "Error fetching cargo trend", error: error.message });
  }
};

// controller for dashboard/cargoperformance -> top commodities handled
export const getTopCommodities = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;

    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.ATABerth = {};
      if (startDate) matchFilter.ATABerth.$gte = new Date(startDate);
      if (endDate) matchFilter.ATABerth.$lte = new Date(endDate);
    }

    // Ignore null/empty commodities
    matchFilter.Commodity = { $nin: [null, ""] };

    const pipeline = [
      { $match: matchFilter },
      {
        $group: {
          _id: "$Commodity",
          totalVolume: { $sum: { $ifNull: ["$MT", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          commodity: "$_id",
          volume: "$totalVolume",
        },
      },
      { $sort: { volume: -1 } },
    ];

    if (limit) {
      pipeline.push({ $limit: parseInt(limit, 10) });
    }

    const result = await vessels.aggregate(pipeline);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching commodity volumes", error });
  }
};

// controller for dashboard/cargoperformance -> conrainer traffic trend by month
export const getContainerTrafficTrend = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
/*     console.log(startDate, endDate);
 */
    // Default date range handling
    let start = startDate ? new Date(startDate) : new Date("2020-01-01");
    let end = endDate ? new Date(endDate) : new Date();

    // Normalize start to first of month, end to last day of month
    start = new Date(start.getFullYear(), start.getMonth(), 1);
    end = new Date(end.getFullYear(), end.getMonth() + 1, 0);

    const matchFilter = {};
    matchFilter.ATABerth = { $gte: start, $lte: end };
    matchFilter.Teus = { $gt: 0 }; // Only include records with TEUs > 0

/*     console.log("Container Traffic Filter:", matchFilter);
 */
    const rawData = await vessels.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: "$ATABerth" },
            month: { $month: "$ATABerth" },
          },
          totalTEUs: { $sum: "$Teus" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Convert aggregation result into { "MMM-YYYY": value } map
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dataMap = {};
    rawData.forEach(item => {
      const monthLabel = `${monthNames[item._id.month - 1]}-${item._id.year}`;
      dataMap[monthLabel] = item.totalTEUs;
    });

    // Build continuous month list from start → end
    const result = [];
    let current = new Date(start);
    while (current <= end) {
      const label = `${monthNames[current.getMonth()]}-${current.getFullYear()}`;
      result.push({
        month: label,
        teus: dataMap[label] || 0,
      });
      // move to next month
      current.setMonth(current.getMonth() + 1);
    }

     // Check if all values are zero
    const allZero = result.every(r => r.teus === 0);

    if (allZero) {
      return res.json({
        noData: true,
        message: "No container traffic data available for the selected period",
        data: result,
      });
    }

    res.json({ noData: false, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching container traffic trend", error });
  }
};


// controller for dashboard/cargoperformance -> cargo share

export const getCargoShare = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.ATABerth = {};
      if (startDate) matchFilter.ATABerth.$gte = new Date(startDate);
      if (endDate) matchFilter.ATABerth.$lte = new Date(endDate);
    }

    // group by cargo type, fallback to "Unknown"
    const result = await vessels.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $ifNull: ["$CargoType", "Unknown"] },
          totalVolume: {
            $sum: { $ifNull: ["$MT", 0] }, // sum by MT (metric tons)
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$totalVolume",
        },
      },
      { $sort: { value: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching cargo share:", error);
    res.status(500).json({ message: "Error fetching cargo share", error });
  }
};





