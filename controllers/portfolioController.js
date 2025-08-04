import Portfolio from "../models/portfolioModel.js";
import Service from "../models/serviceModel.js";
import userModel from "../models/userModel.js";

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
      service_title,
      service_type,
      service_duration,
      service_description,
      service_charge,
      meeting_options,
      meeting_link
    } = req.body;
    const userId = req.user.id; // from auth middleware
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
      service_title,
      service_type,
      service_duration,
      service_description,
      service_charge,
      meeting_options,
      meeting_link
    });

    // Create portfolio and link service
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

// GET /api/portfolio/profile
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

