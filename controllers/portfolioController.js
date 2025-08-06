import Portfolio from "../models/portfolioModel.js";
import Service from "../models/serviceModel.js";
import userModel from "../models/userModel.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

export const createPortfolioWithService = async (req, res) => {
  try {
    const {
      specialization,
      gender,
      socialMedia,
      workingMode,
      fixedAddress,
      mobileAddress,
      timeZone,
      currency,
      workingDays,
      title,
      type,
      duration,
      description,
      charge,
      meeting_options,
      meeting_link
    } = req.body;
    const userId = req.user.id;
    const portfolioImages = req.files['portfolioImages']?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || [];

    const profilePic = req.files['profilePic']?.[0];
    const profilePicData = profilePic ? {
      url: profilePic.path,
      public_id: profilePic.filename
    } : null;

    // Create service first
    const service = await Service.create({
      title,
      type,
      duration,
      description,
      charge,
      meeting_options,
      meeting_link,
      user: userId
    });

    const portfolio = await Portfolio.create({
      specialization,
      profilePic: profilePicData,
      portfolioImages,
      gender,
      socialMedia: JSON.parse(socialMedia),
      workingMode,
      fixedAddress,
      mobileAddress,
      timeZone,
      currency,
      workingDays: JSON.parse(workingDays),
      service: service._id
    });

    // Update user with portfolio reference
    await userModel.findByIdAndUpdate(userId, { portfolio: portfolio._id });

    res.status(201).json({ message: "Portfolio and Service created", portfolio, service });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updatePortfolioWithService = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).populate('portfolio');

    if (!user || !user.portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const portfolio = await Portfolio.findById(user.portfolio._id).populate('service');

    // Handle profilePic replacement
    if (req.files['profilePic']) {
      const oldPublicId = portfolio.profilePic?.public_id;
      if (oldPublicId) await deleteFromCloudinary(oldPublicId);

      const newPic = req.files['profilePic'][0];
      portfolio.profilePic = {
        url: newPic.path,
        public_id: newPic.filename
      };
    }

    // Handle portfolioImages replacement
    if (req.files['portfolioImages']) {
      const oldImages = portfolio.portfolioImages || [];
      for (const img of oldImages) {
        if (img.public_id) await deleteFromCloudinary(img.public_id);
      }

      portfolio.portfolioImages = req.files['portfolioImages'].map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    // Update Portfolio dynamically
    const portfolioFields = [
      "specialization", "gender", "socialMedia", "workingMode", "fixedAddress",
      "mobileAddress", "timeZone", "currency", "workingDays"
    ];
    portfolioFields.forEach(field => {
      if (req.body[field]) {
        portfolio[field] = ["socialMedia", "workingDays"].includes(field)
          ? JSON.parse(req.body[field])
          : req.body[field];
      }
    });

    await portfolio.save();

    // Update Service dynamically
    const serviceFields = [
      " title", " type", " duration", " description",
      " charge", "meeting_options", "meeting_link"
    ];
    const service = await Service.findById(portfolio.service);
    serviceFields.forEach(field => {
      if (req.body[field]) {
        service[field] = req.body[field];
      }
    });
    await service.save();

    res.status(200).json({ message: "Portfolio and service updated successfully", portfolio, service });

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId)
      .select("-password")
      .populate({
        path: "portfolio",
        populate: {
          path: "service",
          model: "Service"
        }
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "status"
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update." });
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


