import vessels from "../models/vesselModel.js";



export const getBerthOccupancy = async (req, res) => {
  try {
    const { startDate, endDate, totalBerths, berth } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required",
      });
    }

    if (!totalBerths) {
      return res.status(400).json({
        message: "totalBerths is required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // -----------------------------
    // Match ONLY berth (NOT dates)
    // -----------------------------
    const matchFilter = {};
    if (berth && berth !== "All") {
      matchFilter.Berth = berth;
    }

    // -----------------------------
    // Aggregate with CLIPPED duration
    // -----------------------------
    const result = await vessels.aggregate([
      { $match: matchFilter },
      {
        $project: {
          berthDurationHours: {
            $divide: [
              {
                $subtract: [
                  { $min: ["$ATDUnberth", end] },
                  { $max: ["$ATABerth", start] },
                ],
              },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $project: {
          berthDurationHours: {
            $cond: [
              { $gt: ["$berthDurationHours", 0] },
              "$berthDurationHours",
              0,
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

    // -----------------------------
    // Available hours (CRITICAL FIX)
    // -----------------------------
    const totalHours =
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const effectiveBerths =
      berth && berth !== "All" ? 1 : Number(totalBerths);

    const totalAvailableHours = totalHours * effectiveBerths;

    // -----------------------------
    // CAP OCCUPANCY (MANDATORY)
    // -----------------------------
    const adjustedOccupiedHours = Math.min(
      totalOccupiedHours,
      totalAvailableHours
    );

    const occupancy =
      totalAvailableHours > 0
        ? (adjustedOccupiedHours / totalAvailableHours) * 100
        : 0;

    console.log(
      "Berth:",
      berth || "All",
      "Occupied:",
      adjustedOccupiedHours,
      "Available:",
      totalAvailableHours,
      "Occupancy:",
      occupancy
    );

    res.json({
      berth: berth || "All Berths",
      totalOccupiedHours: Math.round(adjustedOccupiedHours * 100) / 100,
      totalAvailableHours: Math.round(totalAvailableHours * 100) / 100,
      occupancy: Math.round(occupancy * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating berth occupancy",
      error,
    });
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




export const getBerthVesselTimeline = async (req, res) => {
  try {
    const { berthId } = req.params;
    const { date } = req.query;

    // -----------------------------
    // Normalize date (full day)
    // -----------------------------
    let startOfDay, endOfDay;

    if (date) {
      const d = new Date(date);
      startOfDay = new Date(d.setHours(0, 0, 0, 0));
      endOfDay = new Date(d.setHours(23, 59, 59, 999));
    } else {
      const today = new Date();
      startOfDay = new Date(today.setHours(0, 0, 0, 0));
      endOfDay = new Date(today.setHours(23, 59, 59, 999));
    }

    // -----------------------------
    // 🟢 CURRENT (max 1)
    // -----------------------------
    const current = await vessels
      .findOne({
        Berth: berthId,
        ATA: { $lte: endOfDay },
        $or: [{ ATD: null }, { ATD: { $gte: startOfDay } }],
      })
      .sort({ ATA: -1 }) // latest arrival wins
      .lean();

    // -----------------------------
    // ⚫ PAST (last 2 only)
    // -----------------------------
    const past = await vessels
      .find({
        Berth: berthId,
        ATD: { $lt: startOfDay },
      })
      .sort({ ATD: -1 }) // most recent first
      .limit(2)
      .lean();

    // -----------------------------
    // 🔵 FUTURE (next 2 only)
    // -----------------------------
    const future = await vessels
      .find({
        Berth: berthId,
        ATA: { $gt: endOfDay },
      })
      .sort({ ATA: 1 }) // earliest first
      .limit(2)
      .lean();

    // -----------------------------
    // Response
    // -----------------------------
    res.status(200).json({
      berthId,
      date: { startOfDay, endOfDay },
      current,
      past,
      future,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching berth vessel timeline",
      error,
    });
  }
};



