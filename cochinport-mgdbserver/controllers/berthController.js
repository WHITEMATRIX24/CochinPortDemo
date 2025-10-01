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

// ✅ Get all vessels (unique per berth, latest by ATA/ATD)

export const getVessels = async (req, res) => {
  try {
    const { cargoType, country, date } = req.query;
    const query = {};

    if (cargoType && cargoType !== "All") query.CargoType = cargoType;
    if (country && country !== "All") query.FlagCountry = country;

    // If date is provided, normalize to start/end of that day
    let targetDate = null;
    if (date) {
      const d = new Date(date);
      targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    } else {
      // Default: today
      const today = new Date();
      targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    const data = await vessels.find(query).lean();

    const berthMap = new Map();

    data.forEach((item) => {
      // Normalize arrival/departure dates
      const ata = item.ATA ? new Date(item.ATA) : null;
      const atd = item.ATD ? new Date(item.ATD) : null;

      // A berth is occupied if targetDate lies between ATA and ATD
      const isOccupied =
        ata && atd
          ? targetDate >= new Date(ata.setHours(0, 0, 0, 0)) &&
            targetDate <= new Date(atd.setHours(23, 59, 59, 999))
          : false;

      const existing = berthMap.get(item.Berth);

      // Pick latest vessel if multiple, otherwise keep first
      if (!existing) {
        berthMap.set(item.Berth, {
          berthId: item.Berth,
          isOccupied,
          currentVessel: isOccupied ? item : null,
        });
      } else {
        // If berth already exists but this vessel is later and occupied
        const existingVessel = existing.currentVessel;
        const existingDate = existingVessel?.ATA ? new Date(existingVessel.ATA) : new Date(0);
        const currentDate = ata || atd || new Date(0);

        if (isOccupied && currentDate > existingDate) {
          berthMap.set(item.Berth, {
            berthId: item.Berth,
            isOccupied,
            currentVessel: item,
          });
        }
      }
    });

    // Any berth not having currentVessel will be marked available
    const uniqueBerths = Array.from(berthMap.values());

    res.json(uniqueBerths);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vessels", error });
  }
};


