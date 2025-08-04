import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from './routes/portfolioRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use("/api/services", serviceRoutes)
app.get("/", (req, res) => {
  res.send("Server is running ✅ \n <h1>/api/auth/register </h1>\n <h1>/api/portfolio/create</h1>\n <h1>/api/auth/login </h1>");
});

export default app;
