
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
export const register=async function(req, res) {
  const { email, password, name } = req.body;
  if (!email || !name || !password)
    return res.json({ success: false, message: "Missing Details" });
try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
     const user = new userModel({ name, email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      //secure: process.env.NODE_ENV === "Development" ,
      //sameSite: process.env.NODE_ENV === "Development" ?'none':'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    } catch (err) {
    res.json({ success: false, message: err.message });
  }
}
export  const  login= async function(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({
      success: false,
      message: "Email and Password are required!",
    });
    try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid Email!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Password!" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged In Successfully!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

export const logout = async function(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      //secure: process.env.NODE_ENV === "Production" ,
      //sameSite: process.env.NODE_ENV === "Production" ?'none':'strict',
      
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}
