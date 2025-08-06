import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ["provider", "customer", "other"], default: "customer" },
  avatar: { type: String },
  portfolio: { type: mongoose.Types.ObjectId, ref: 'Portfolio' },
  status: { type: String, enum: ["active", "inactive", "suspended", "pending"], default: "active" },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
export default mongoose.model("User", userSchema);
