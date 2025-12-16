import mongoose from "mongoose";

const vesselSchema = new mongoose.Schema({
  VslID: String,
  Berth: String,
  CargoType: String,
  FlagCountry: String,
  ForeignCoastal: String,
  Commodity: String,
  GRT: Number,
  NRT: Number,
  DeadWeight: Number,
  
  // Key Timestamps as ISODate
  ATA: Date,       // Arrival outer roads
  ATABerth: Date,  // Date + Time of Berthing
  ATD: Date,       // Departure outer roads
  ATDUnberth: Date, // Date + Time of Unberthing
  NOR: Date,
  PilotBoarding: Date,
  PilotUnboarding: Date,
  TrtBoardingDeboarding:Number,
  PBD_Total:Number,
  PBD_Non_Port:Number,
  PBD_Port:Number,
  MT: Number,
  Teus: Number,
  MnthYear: String, // keep as string since it's "Apr-24"
  IdleHrs: Number,
   // -------------------------------------------------
  // NEW FIELDS
  // -------------------------------------------------

  WorkCommPort: Date,
  WorkCommNonPort: Date,
  WorkCompPort: Date,
  WorkCompNonPort: Date,

  IMTime: Number,

  SNWB_Port: Number,
  SNWB_NonPort: Number,
  SNWB_Total: Number,

  Shifting_Port: Number,
  Shifting_NonPort: Number,
  Shifting_Total: Number,

  SWB_Port: Number,
  SWB_NonPort: Number,
  SWB_Total: Number,

  Idling_Port: Number,
  Idling_NonPort: Number,

  OMTime: Number,

  TRT_Port: Number,
  TRT_NonPort: Number,
  TRT_Total: Number,
  TRT_NOR: Number,
});

export default mongoose.model("vessels", vesselSchema);
