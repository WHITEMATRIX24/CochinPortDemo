import mongoose from "mongoose";
import csv from "csvtojson";
import vessels from "./models/vesselModel.js";
import dotenv from "dotenv";

dotenv.config();

// Helper: convert "dd.mm.yyyy hh:mm:ss" → JS Date safely
const parseDate = (dateStr, timeStr) => {
  if (!dateStr || dateStr.trim() === "" || dateStr.includes("###")) return null;

  const [day, month, year] = dateStr.split(".");
  if (!day || !month || !year) return null;

  let isoString = `${year}-${month}-${day}`;
  if (timeStr && timeStr.trim() !== "" && !timeStr.includes("###")) {
    isoString += `T${timeStr}`;
  } else {
    isoString += "T00:00:00";
  }

  const d = new Date(isoString);
  return isNaN(d.getTime()) ? null : d;
};

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

const importData = async () => {
  try {
    const vessel = await csv().fromFile("vesselDEtails.csv");

const safeNumber = (val) => {
  if (!val || val.trim() === "" || val.includes("###")) return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};
// Convert hh:mm:ss → seconds
const parseDuration = (val) => {
  if (!val || val.trim() === "" || val.includes("###")) return 0;

  // If already numeric, return as number
  if (!isNaN(val)) return Number(val);

  const parts = val.split(":").map(Number);
  if (parts.length !== 3) return 0;

  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s; // total seconds
};

const parsedVessels = vessel.map(v => ({
  VslID: v.VslID,
  Berth: v.Berth,
  CargoType: v["Cargo Type"],
  FlagCountry: v["Flag/Country Code"],
  ForeignCoastal: v["Foreign Coastal Indicator"],
  Commodity: v["Commodity Code"],
  GRT: safeNumber(v.GRT),
  NRT: safeNumber(v.NRT),
  DeadWeight: safeNumber(v["Dead Weight"]),

  ATA: parseDate(v["ATA - Outer Roads"], v["Actual Time of Arriv"]),
  ATABerth: parseDate(v["Actual Date of Berthing"], v["Actual Time of Berth"]),
  ATD: parseDate(v["ATD - Outer Roads"], v["Actual Time of Depar"]),
  ATDUnberth: parseDate(v["Actual Date of Unberthing"], v["Actual Time of Unberthing"]),
  NOR: parseDate(v["NOR Date"], v["NOR time"]),
  PilotBoarding: parseDate(v["PILOT BOARDING DATE"], v["PILOT BOARDING TIME"]),
  PilotUnboarding: parseDate(v["PILOT UNBOARDING DATE"], v["PILOT UNBOARDING TIME"]),

  TrtBoardingDeboarding: safeNumber(v["TRT BOARDING & DEBOARDING"]),
  PBD_Total: parseDuration(v["PBD Total"]),
  PBD_Non_Port: parseDuration(v["PBD (Non Port)"]),
  PBD_Port: parseDuration(v["PBD_Port"]),

  MT: safeNumber(v.MT),
  Teus: safeNumber(v.Teus),
  MnthYear: v.MnthYear,
  IdleHrs: safeNumber(v["Idle Hrs"]),
}));

    await vessels.insertMany(parsedVessels);
    console.log("✅ Data Imported with ISODate");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

importData();
