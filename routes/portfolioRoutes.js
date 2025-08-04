import express from "express";
import { createPortfolioWithService, getUserProfile } from "../controllers/portfolioController.js";
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
router.get('/profile', authMiddleware, getUserProfile)

export default router;
