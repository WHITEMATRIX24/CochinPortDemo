import vessels from "../models/vesselModel.js";



export const getBerthOccupancy = async (req, res) => {
  try {
    const { startDate, endDate, totalBerths, berth } = req.query;

    if (!totalBerths) {
      return res.status(400).json({ message: "totalBerths is required" });
    }

    // Build filter
    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.ATABerth = {};
      if (startDate) matchFilter.ATABerth.$gte = new Date(startDate);
      if (endDate) matchFilter.ATABerth.$lte = new Date(endDate);
    }

    // If a specific berth is selected, filter by it
    if (berth && berth !== "All") {
      matchFilter.Berth = berth;
    }

    const result = await vessels.aggregate([
      { $match: matchFilter },
      {
        $project: {
          berthDurationHours: {
            $divide: [
              { $subtract: ["$ATDUnberth", "$ATABerth"] },
              1000 * 60 * 60, // convert ms → hours
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOccupiedHours: { $sum: "$berthDurationHours" },
        },
      },
    ]);

    const totalOccupiedHours = result[0]?.totalOccupiedHours || 0;

    // Calculate total available hours in the given range
    const start = startDate ? new Date(startDate) : new Date("1970-01-01");
    const end = endDate ? new Date(endDate) : new Date();
    const totalHours = Math.abs(end - start) / (1000 * 60 * 60);
    const totalAvailableHours = totalHours * Number(totalBerths);

    const occupancy =
      totalAvailableHours > 0
        ? (totalOccupiedHours / totalAvailableHours) * 100
        : 0;

/*     console.log("Occupancy:", occupancy, "Total Available Hours:", totalAvailableHours, "Total Occupied Hours:", totalOccupiedHours);
 */
    res.json({
      berth: berth || "All Berths",
      totalOccupiedHours,
      totalAvailableHours,
      occupancy: Math.round(occupancy * 100) / 100, // 2 decimals
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating berth occupancy", error });
  }
};


// Get all distinct berths
export const getBerths =  async (req, res) => {
  try {
    const berths = await vessels.distinct("Berth");
    res.json(berths);
  } catch (error) {
    res.status(500).json({ message: "Error fetching berths", error });
  }
};


