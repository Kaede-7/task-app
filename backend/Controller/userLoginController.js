import User from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const TOKEN_KEY = process.env.JWT_KEY || "1234567890";

const validateCredentials = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "The password you entered is not correct",
      });
    }

    // Create JWT token
    const loginToken = jwt.sign(
      { _id: user._id, username: user.username },
      TOKEN_KEY,
      { expiresIn: "20m" }
    );

    // Save token in DB and return updated user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { accessToken: loginToken },
      { new: true }
    );

    return res.status(200).json({
      message: "Password Validated Successfully",
      result: updatedUser,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export { validateCredentials };