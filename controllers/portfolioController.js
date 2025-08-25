import Portfolio from "../models/portfolioModel.js";
import Service from "../models/serviceModel.js";
import userModel from "../models/userModel.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";


// ✅ Update provider earning goal
export const updateGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalEarning, totalDays, savingPercentage } = req.body;

    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    portfolio.goal = {
      totalEarning,
      totalDays,
      savingPercentage,
      startDate: Date.now()
    };

    await portfolio.save();

    res.status(200).json({ message: "Goal updated successfully", goal: portfolio.goal });
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error: error.message });
  }
};

// ✅ Update provider service settings
export const updateServiceSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { depositPercentage, minNoticePeriod } = req.body;

    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    portfolio.serviceSettings = {
      depositPercentage: depositPercentage ?? portfolio.serviceSettings.depositPercentage,
      minNoticePeriod: minNoticePeriod ?? portfolio.serviceSettings.minNoticePeriod
    };

    await portfolio.save();

    res.status(200).json({ 
      message: "Service settings updated successfully", 
      serviceSettings: portfolio.serviceSettings 
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating service settings", error: error.message });
  }
};

// ✅ Get provider settings (goal + serviceSettings)
export const getProviderSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const portfolio = await Portfolio.findOne({ user: userId }).select("goal serviceSettings currency");

    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    res.status(200).json({
      goal: portfolio.goal,
      serviceSettings: portfolio.serviceSettings,
      currency: portfolio.currency
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching provider settings", error: error.message });
  }
};


// export const setGoal = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { totalEarning, totalDays, savingPercentage } = req.body;

//     let portfolio = await Portfolio.findOne({ _id: req.body.portfolioId, user: userId });

//     if (!portfolio) {
//       return res.status(404).json({ message: "Portfolio not found" });
//     }

//     portfolio.goal = { totalEarning, totalDays, savingPercentage, startDate: Date.now() };
//     await portfolio.save();

//     res.status(200).json({ message: "Goal set successfully", goal: portfolio.goal });
//   } catch (error) {
//     res.status(500).json({ message: "Error setting goal", error: error.message });
//   }
// };


export const getGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const portfolio = await Portfolio.findOne({ user: userId }).select("goal currency");

    if (!portfolio || !portfolio.goal) {
      return res.status(404).json({ message: "No goal found" });
    }

    res.status(200).json({ goal: portfolio.goal, currency: portfolio.currency });
  } catch (error) {
    res.status(500).json({ message: "Error fetching goal", error: error.message });
  }
};

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
      meeting_link,
      // ✅ New fields for goals & service settings
      totalEarning,
      totalDays,
      savingPercentage,
      depositPercentage,
      minNoticePeriod
    } = req.body;

    const userId = req.user.id;

    // Images handling
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

    // Create portfolio
    const portfolio = await Portfolio.create({
      specialization,
      profilePic: profilePicData,
      portfolioImages,
      gender,
      socialMedia: socialMedia ? JSON.parse(socialMedia) : [],
      workingMode,
      fixedAddress,
      mobileAddress,
      timeZone,
      currency,
      workingDays: workingDays ? JSON.parse(workingDays) : [],
      services: [service._id],   // ✅ updated to array

      user: userId,

      // ✅ Include goal if provided
      goal: totalEarning && totalDays && savingPercentage ? {
        totalEarning,
        totalDays,
        savingPercentage,
        startDate: Date.now()
      } : {},

      // ✅ Include service settings if provided
      serviceSettings: {
        depositPercentage: depositPercentage || 0,
        minNoticePeriod: minNoticePeriod || 0
      }
    });

    // Update user with portfolio reference
    await userModel.findByIdAndUpdate(userId, { portfolio: portfolio._id });

    res.status(201).json({
      message: "Portfolio and Service created",
      portfolio,
      service
    });

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


