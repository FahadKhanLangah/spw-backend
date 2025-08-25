import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import { addAddress, deleteAddress, getAddresses, updateAddress, updateUser } from "../controllers/userController.js";

const router = express.Router();

// update user profile like name, phone, preference
router.put("/update-info", authMiddleware, updateUser)
router.post("/add-address", authMiddleware, addAddress);
router.get("/get-addresses", authMiddleware, getAddresses);
router.put("/update-address/:addressId", authMiddleware, updateAddress);
router.delete("/delete-address/:addressId", authMiddleware,deleteAddress);

export default router;
