// controllers/statisticsController.js
import vessels from "../models/vesselModel.js";
export const getKPIData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    
    // Build date filter
    let matchStage = {};
    if (startDate && endDate) {
      matchStage = {
        ATA: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const totalThroughput = await vessels.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: "$MT" } } }
    ]);

    const dryCargo = await vessels.aggregate([
      { $match: { ...matchStage, CargoType: "Dry Bulk Mechanical" } },
      { $group: { _id: null, total: { $sum: "$MT" } } }
    ]);

    const liquidCargo = await vessels.aggregate([
      { $match: { ...matchStage, CargoType: "Liquid Bulk" } },
      { $group: { _id: null, total: { $sum: "$MT" } } }
    ]);

    const containers = await vessels.aggregate([
      { $match: { ...matchStage, CargoType: "Containerised" } },
      { $group: { _id: null, total: { $sum: "$Teus" } } }
    ]);

    const avgTurnaround = await vessels.aggregate([
      { $match: matchStage },
      {
        $project: {
          turnaroundHrs: {
            $divide: [
              { $subtract: ["$ATD", "$ATA"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      { $group: { _id: null, avg: { $avg: "$turnaroundHrs" } } }
    ]);

    const idleTime = await vessels.aggregate([
      { $match: matchStage },
      { $group: { _id: null, avg: { $avg: "$IdleHrs" } } }
    ]);

    // ✅ Berth Occupancy Rate
    const berthOccupancy = await vessels.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalBerthHrs: { $sum: "$BerthTimeHrs" },
          totalIdleHrs: { $sum: "$IdleHrs" }
        }
      },
      {
        $project: {
          occupancyRate: {
            $cond: [
              { $eq: [{ $add: ["$totalBerthHrs", "$totalIdleHrs"] }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ["$totalBerthHrs", { $add: ["$totalBerthHrs", "$totalIdleHrs"] }]
                  },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);

/*     console.log(totalThroughput, dryCargo);
 */    
    res.json({
      totalThroughput: totalThroughput[0]?.total || 0,
      dryCargo: dryCargo[0]?.total || 0,
      liquidCargo: liquidCargo[0]?.total || 0,
      containers: containers[0]?.total || 0,
      avgTurnaround: avgTurnaround[0]?.avg || 0,
      idleTime: idleTime[0]?.avg || 0,
      berthOccupancyRate: berthOccupancy[0]?.occupancyRate || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


