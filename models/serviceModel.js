import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  category: {
  type: String,
  // required: true,
  // enum: ["Plumbing", "Electrician", "Cleaning", "Tutoring", "IT Services", "Other"], // you can expand later
},
  description: { type: String, required: true },
  charge: { type: String, required: true },
  meeting_options: { type: String, },
  meeting_link: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
