import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ["provider", "customer", "other"], default: "customer" },
  avatar: { type: String },
  portfolio: { type: mongoose.Types.ObjectId, ref: 'Portfolio' }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
