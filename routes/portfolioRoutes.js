import express from "express";
import { createPortfolioWithService, getUserProfile, updatePortfolioWithService } from "../controllers/portfolioController.js";
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

export default router;
