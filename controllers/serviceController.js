import Service from "../models/serviceModel.js";
import Portfolio from "../models/portfolioModel.js";

export const getAllServices = async (req, res) => {
  try {
    const { search, type, minRating, city } = req.query;

    let filters = {};

    // 🔎 Search only by title
    if (search && search.trim() !== "") {
      filters.title = { $regex: search.trim(), $options: "i" };
    }

    // ⭐ Rating filter (allow rating = 0)
    if (minRating !== undefined && minRating !== null) {
      filters.rating = { $gte: Number(minRating) };
    }

    let services = await Service.find(filters)
      .populate("user", "firstName lastName email role")
      .sort({ createdAt: -1 });


    if (city) {
      const portfolios = await Portfolio.find({
        $or: [
          { fixedAddress: { $regex: city, $options: "i" } },
          { mobileAddress: { $regex: city, $options: "i" } }
        ]
      }).select("user");

      const providerIds = portfolios.map(p => p.user.toString());

      services = services.filter(s => providerIds.includes(s.user._id.toString()));
    }

    res.status(200).json({
      count: services.length,
      services
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};