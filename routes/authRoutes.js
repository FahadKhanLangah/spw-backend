import express from "express";
import { register, login } from "../controllers/authController.js";
import { updateUserProfile } from "../controllers/portfolioController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", authMiddleware, updateUserProfile)

export default router;
