import "dotenv/config"; 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userAuth from "./middleware/userAuth.js";


const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true,}))
app.get("/", (req, res) => {
    //API END POINT
  res.send("API is working.");
  
});
app.use("/api/auth", authRouter);
//app.use("/api/user", userRouter);
app.listen(port, () => {
  console.log("Server is started on port 4000");
});
