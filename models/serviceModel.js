import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  charge: { type: String, required: true },
  meeting_options: { type: String, },
  meeting_link: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
