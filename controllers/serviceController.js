import serviceModel from "../models/serviceModel.js";

export const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find().sort({ createdAt: -1 });
    res.status(200).json({ count: services.length, services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};