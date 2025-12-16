import mongoose from "mongoose";
import xlsx from "xlsx";
import vessels from "./models/vesselModel.js";
import dotenv from "dotenv";

dotenv.config();

/* ============================================================
   UNIVERSAL CLEAN STRING (removes invisible chars)
============================================================ */
const cleanString = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")   // control chars
    .replace(/[\u200E\u200F\u202A-\u202E]/g, "")    // bidi marks
    .replace(/\u00A0/g, "")                         // NBSP
    .trim();
};

/* ============================================================
   EXCEL DATE/TIME CONVERTERS
============================================================ */

// Excel numeric time (0.5 = 12:00 PM)
const excelTimeToString = (time) => {
  if (typeof time !== "number") return time;
  let sec = Math.round(time * 86400);
  let h = String(Math.floor(sec / 3600)).padStart(2, "0");
  let m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  let s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

// Excel numeric date serial → dd.mm.yyyy
const excelDateToString = (excelNum) => {
  if (typeof excelNum !== "number") return excelNum;
  const jsDate = new Date((excelNum - 25569) * 86400 * 1000);
  if (isNaN(jsDate)) return null;
  const d = String(jsDate.getDate()).padStart(2, "0");
  const m = String(jsDate.getMonth() + 1).padStart(2, "0");
  const y = jsDate.getFullYear();
  return `${d}.${m}.${y}`;
};

/* ============================================================
   TIME SANITIZER (fixes ALL Excel time issues)
============================================================ */
const sanitizeTime = (t) => {
  if (!t) return "00:00:00";

  // Excel numeric time
  if (typeof t === "number" && t > 0 && t < 1) {
    return excelTimeToString(t);
  }

  t = cleanString(t).replace(/[^\d:]/g, "");

  if (!t) return "00:00:00";

  // Case: H:MM:SS → pad leading zero
  if (/^\d:\d{2}:\d{2}$/.test(t)) {
    t = "0" + t;
  }

  // HHMMSS (6 digits)
  if (/^\d{6}$/.test(t)) {
    return t.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
  }

  // HHMM (4 digits)
  if (/^\d{4}$/.test(t)) {
    return t.replace(/(\d{2})(\d{2})/, "$1:$2:00");
  }

  // HH:mm → add seconds
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    return t + ":00";
  }

  return t;
};

const safeNumber = (val) => {
  if (val == null) return 0;

  let cleaned = cleanString(val)
    .replace(/,/g, "")     // remove commas
    .replace(/\s+/g, "");  // remove spaces

  if (!cleaned || cleaned.includes("###")) return 0;

  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};


/* ============================================================
   MASTER DATE PARSER (guaranteed correct)
============================================================ */
const parseDate = (dateStr, timeStr) => {
  if (!dateStr) return null;

  // Excel numeric date
  if (typeof dateStr === "number") {
    dateStr = excelDateToString(dateStr);
  }

  // Clean & normalize
  dateStr = cleanString(dateStr)
    .replace(/[^\d.]/g, "")
    .trim();

  if (!dateStr) return null;

  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;

  let [day, month, year] = parts;

  day = day.padStart(2, "0");
  month = month.padStart(2, "0");
  if (year.length === 2) year = "20" + year;

  // Clean & correct time
  timeStr = sanitizeTime(timeStr);

  // ⭐ FORCE UTC (prevents 5:30 shift)
  const iso = `${year}-${month}-${day}T${timeStr}Z`;

  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

/* ============================================================
   PARSE DURATION → seconds
============================================================ */
const parseDuration = (val) => {
  if (val == null) return 0;

  // Excel numeric time
  if (typeof val === "number" && val > 0 && val < 1) {
    return Math.round(val * 86400);
  }

  val = cleanString(val);

  if (!val || val.includes("###")) return 0;
  if (!isNaN(val)) return Number(val);

  const parts = val.split(":").map(Number);
  if (parts.some(isNaN)) return 0;

  const [h = 0, m = 0, s = 0] = parts;
  return h * 3600 + m * 60 + s;
};

/* ============================================================
   READ ALL SHEETS
============================================================ */
const readExcelAllSheets = (filePath) => {
  const workbook = xlsx.readFile(filePath, { cellDates: false });
  let allRows = [];

  workbook.SheetNames.forEach((sheet) => {
    const sheetJson = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], {
      raw: false,
      defval: null
    });

    console.log(`📄 Loaded ${sheetJson.length} rows from sheet: ${sheet}`);
    allRows = allRows.concat(sheetJson);
  });

  return allRows;
};

/* ============================================================
   MAIN IMPORT FUNCTION
============================================================ */

mongoose.connect(process.env.DATABASE);

const importData = async () => {
  try {
    const rows = readExcelAllSheets("data1.xlsx");

    const parsed = rows.map((r) => ({
      // OLD FIELDS
      VslID: r["Vessel Call Number"] || r.VslID,
      Berth: r.Berth,
      CargoType: r["CALM Cargo Type"] || r["Cargo Type"],
      FlagCountry: r["Flag/Country Code"],
      ForeignCoastal: r["Foreign Coastal Indicator"],
      Commodity: r["Commodity Code"],

      GRT: safeNumber(r.GRT) || 0,
      NRT: safeNumber(r.NRT) || 0,
      DeadWeight: safeNumber(r["Dead Weight"]) || 0,

      ATA: parseDate(r["ATA - Outer Roads"], r["Actual Time of Arriv"]),
      ATABerth: parseDate(r["Actual Date of Berthing"], r["Actual Time of Berth"]),
      ATDUnberth: parseDate(r["Actual Date of Unberthing"], r["Actual Time of Unberthing"]),
      ATD: parseDate(r["ATD - Outer Roads"], r["Actual Time of Depar"]),

      NOR: parseDate(r["NOR Date"], r["NOR Time"]),

      PilotBoarding: parseDate(r["PILOT BOARDING DATE"], r["PILOT BOARDING TIME"]),
      PilotUnboarding: parseDate(r["PILOT UNBOARDING DATE"], r["PILOT UNBOARDING TIME"]),

      TrtBoardingDeboarding: parseDuration(r["TRT BOARDING & DEBOARDING"]) || 0,

      PBD_Port: parseDuration(r["PBD (Port)"]),
      PBD_Non_Port: parseDuration(r["PBD (Non Port)"]),
      PBD_Total: parseDuration(r["PBD Total"]),

      MT: safeNumber(r.MT) || 0,
      Teus: safeNumber(r.Teus) || 0,
      MnthYear: r.MnthYear,
      IdleHrs: safeNumber(r["Idle Hrs"]) || 0,

      // NEW FIELDS
      WorkCommPort: parseDate(r["WORK COMMENCEMENT (PORT)"]),
      WorkCommNonPort: parseDate(r["WORK COMMENCEMENT (NON PORT)"]),

      WorkCompPort: parseDate(r["WORK COMPLETION PO"]),
      WorkCompNonPort: parseDate(r["WORK COMPLETION NPO"]),

      IMTime: parseDuration(r["IM TIME"]),

      SNWB_Port: parseDuration(r["SNWB (PORT)"]),
      SNWB_NonPort: parseDuration(r["SNWB (NON PORT)"]),
      SNWB_Total: parseDuration(r["SNWB [TOTAL]"]),

      Shifting_Port: parseDuration(r["SHIFTING (PORT )"]),
      Shifting_NonPort: parseDuration(r["SHIFTING (NON PORT )"]),
      Shifting_Total: parseDuration(r["SHIFTING (TOTAL)"]),

      SWB_Port: parseDuration(r["SWB (PORT)"]),
      SWB_NonPort: parseDuration(r["SWB (NON PORT)"]),
      SWB_Total: parseDuration(r["SWB (TOTAL)"]),

      Idling_Port: parseDuration(r["IDLING PORT"]),
      Idling_NonPort: parseDuration(r["IDLING NON PORT"]),

      OMTime: parseDuration(r["OM TIME"]),

      TRT_Port: parseDuration(r["TRT (Port)"]),
      TRT_NonPort: parseDuration(r["TRT (NonPort)"]),
      TRT_Total: parseDuration(r["TRT (TOTAL)"]),
      TRT_NOR: parseDuration(r["TRT NOR"]),
    }));

    await vessels.insertMany(parsed);

    console.log(`✅ SUCCESS: Imported ${parsed.length} rows.`);
    process.exit();
  } catch (err) {
    console.error("❌ Import Error:", err);
    process.exit(1);
  }
};

importData();
