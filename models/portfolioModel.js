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

  service: { type: mongoose.Types.ObjectId, ref: "Service" },
  goal: {
    totalEarning: { type: Number },
    totalDays: { type: Number },
    savingPercentage: { type: Number },
    startDate: { type: Date, default: Date.now }
  },

  serviceSettings: {
    depositPercentage: { type: Number, default: 0 },  // % customer must deposit
    minNoticePeriod: { type: Number, default: 0 }     // notice period in hours/days
  },

  // ✅ Link portfolio to a user (important for auth)
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
