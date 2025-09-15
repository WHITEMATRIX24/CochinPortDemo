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
});

export default mongoose.model("vessels", vesselSchema);
