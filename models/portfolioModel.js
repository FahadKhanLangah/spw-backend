import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  specialization: { type: String, required: true },
  portfolioImages: [{
    url: { type: String },
    public_id: { type: String }
  }],
  profilePic: {
    url: { type: String },
    public_id: { type: String }
  },
  gender: { type: String, enum: ["male", "female", "other"] },
  socialMedia: [{
    name: { type: String },
    link: { type: String }
  }],
  workingMode: { type: String, enum: ["fixed", "mobile", "both"] },
  fixedAddress: { type: String },
  mobileAddress: { type: String },
  timeZone: { type: String },
  currency: { type: String }, 

  workingDays: [{
    day: { type: String },
    hours: { type: String }
  }],

  service: { type: mongoose.Types.ObjectId, ref: "Service" }
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
