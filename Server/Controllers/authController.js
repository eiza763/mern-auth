
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
// import transporter from "../config/nodemailer.js";

// export const register=async function(req, res) {
//   const { email, password, name } = req.body;
//   if (!email || !name || !password)
//     return res.json({ success: false, message: "Missing Details" });
// try {
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser)
//       return res.json({ success: false, message: "User already exists" });
//     const hashedPassword = await bcrypt.hash(password, 10);
//      const user = new userModel({ name, email, password: hashedPassword });
//     await user.save();
    
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       //secure: process.env.NODE_ENV === "Development" ,
//       //sameSite: process.env.NODE_ENV === "Development" ?'none':'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     const emailOptions = {
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Welcome to eiza's Website",
//       text: `Welcome to our website. Your account has been created with email id : ${email}`,
//     };
//     await transporter.sendMail(emailOptions);

//     return res.json({ success: true });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// }

    
// export  const  login= async function(req, res) {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.json({
//       success: false,
//       message: "Email and Password are required!",
//     });
//     try {
//     const user = await userModel.findOne({ email });
//     if (!user) return res.json({ success: false, message: "Invalid Email!" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.json({ success: false, message: "Invalid Password!" });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({ success: true, message: "Logged In Successfully!" });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// }

// export const logout = async function(req, res) {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       //secure: process.env.NODE_ENV === "Production" ,
//       //sameSite: process.env.NODE_ENV === "Production" ?'none':'strict',
      
//     });
//     return res.json({ success: true, message: "Logged Out" });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// }
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async function(req, res) {
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to eiza's Website",
      text: `Welcome to our website. Your account has been created with email id: ${email}`
    };
    
    await transporter.sendMail(emailOptions);
    return res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

export const login = async function(req, res) {
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

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Login Notification - eiza's Website",
      text: `Hello ${user.name}, you have successfully logged into your account on ${new Date().toLocaleString()}`,
    };
    
    await transporter.sendMail(emailOptions);
    
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
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified)
      return res.json({ success: true, message: "Account already Verified" });

    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = OTP;
    user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is ${OTP}. It is valid for 24 hours.`,
    };

    await transporter.sendMail(emailOptions);

    return res.json({
      success: true,
      message: "Verification OTP sent on email!",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

export const verifyEmail = async (req, res) => {
  const { userId } = req.body;
  const OTP = req.headers["x-otp"];

  if (!userId || !OTP)
    return res.json({ success: false, message: "Missing Details." });
  try {
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.verifyotp === "" || user.verifyotp !== OTP)
      return res.json({ success: false, message: "Invalid OTP" });
    if (user.verifyotpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired!" });

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Email Verified Successfully!",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}
