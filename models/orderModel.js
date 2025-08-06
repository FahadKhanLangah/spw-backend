import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    preferredDate: {
      type: String,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    offer: {
      type: Number,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    attachment: {
      url: String,
      public_id: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, status: 1 });

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
