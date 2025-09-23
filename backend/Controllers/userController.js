import UserModel from "../models/userModel.js";

export async function getUserData(req, res) {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    return res.json({
      success: true,
      userData: { name: user.name, isAccountVerified: user.isAccountVerified },
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
}