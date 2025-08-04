import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  service_title: { type: String, required: true },
  service_type: { type: String, required: true }, // online or inperson
  service_duration: { type: String, required: true }, // time like 2h 15min
  service_description: { type: String, required: true },
  service_charge: { type: String, required: true },
  meeting_options: { type: String, }, // meeting options "video call or audio call"
  meeting_link: { type: String }
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
