import Order from "../models/orderModel.js";
import Service from "../models/serviceModel.js";

export const createOrder = async (req, res) => {
  try {
    const { serviceId, preferredDate, preferredTime, offer, requirements } = req.body;

    // Ensure the service exists
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const order = await Order.create({
      customer: req.user.id,
      service: serviceId,
      preferredDate,
      preferredTime,
      offer,
      requirements,
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("service", "title description")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your orders", error: err.message });
  }
};

export const getProviderOrders = async (req, res) => {
  try {
    const services = await Service.find({ user: req.user.id }).select("_id");
    const serviceIds = services.map((s) => s._id);
    const orders = await Order.find({ service: { $in: serviceIds } })
      .populate("customer", "firstName lastName email")
      .populate("service", "title charge")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch provider orders", error: err.message });
  }
};

