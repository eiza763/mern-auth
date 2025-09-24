import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 8000;

// Connect database
connectDB();
const allowedOrigins =["https://mern-auth-two-gold.vercel.app"]


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,  methods:["POST", "GET", "PUT", "CREATE"],credentials: true }));

// Test route
app.get("/", (req, res) => {
  res.send("API is working.");
});

// Use auth router
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server
app.listen(port, () => {
  console.log("Server is started on port", port);
});
