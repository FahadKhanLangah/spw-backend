import express from "express";
import { createPortfolioWithService, getGoal, getProviderSettings, getUserProfile, updateGoal, updatePortfolioWithService, updateServiceSettings } from "../controllers/portfolioController.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "portfolioImages", maxCount: 10 }
  ]),
  createPortfolioWithService
);
router.get('/profile', authMiddleware, getUserProfile);
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "portfolioImages", maxCount: 10 }
  ]),
  updatePortfolioWithService
);
router.put(
  "/update-goal",
  authMiddleware,
  updateGoal
);
router.put(
  "/update-service-setting",
  authMiddleware,
  updateServiceSettings
);
router.get('/get-my-goals', authMiddleware, getGoal);
router.get('/get-my-setting', authMiddleware, getProviderSettings);

export default router;
