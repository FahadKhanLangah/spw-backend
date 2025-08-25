import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  fullAddress: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  addresses: [addressSchema], 
  preference: { type: String },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ["provider", "customer", "other"], default: "customer" },
  avatar: { type: String },
  portfolio: { type: mongoose.Types.ObjectId, ref: 'Portfolio' },
  status: { type: String, enum: ["active", "inactive", "suspended", "pending"], default: "active" },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
export default mongoose.model("User", userSchema);
