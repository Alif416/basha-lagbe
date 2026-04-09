import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.auth.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import listingRouter from "./routes/listing.route.js";
import dns from 'node:dns/promises'; 
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Use Google Public DNS

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Successfully!"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/server/auth", authRouter);
app.use("/server/user", userRouter);
app.use("/server/admin", adminRouter);
app.use("/server/properties", propertyRoutes);
app.use("/server/listing", listingRouter);

// Health check
app.get("/server/health", (req, res) => res.json({ status: "ok" }));

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

// Local dev only — Vercel uses the exported app as a serverless function
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => console.log("Server running on port: 5000"));
}

export default app;
