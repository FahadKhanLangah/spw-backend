import express from "express";
import {
  createOrder,
  getMyOrders,
  getProviderOrders
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/provider-orders", authMiddleware, getProviderOrders);

export default router;
