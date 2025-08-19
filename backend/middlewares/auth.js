const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const TOKEN_KEY = process.env.JWT_KEY || "1234567890";

const verifyToken = async (req, res, next) => {
  const { username } = req.body;
  const token = req.headers["access-token"];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token entered in the header" });
  }

  try {
    const result = await User.findOne({ username: username });
    if (!result || result.accessToken !== token) {
      return res.status(401).json({ success: false, message: "Token Not Verified!!" });
    }

    jwt.verify(token, TOKEN_KEY);
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = verifyToken;
