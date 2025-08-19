const User = require("../Model/userModel");
const schemaValidator = require("../helper/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TOKEN_KEY = process.env.JWT_KEY || "1234567890";

const registerUser = async (req, res) => {
  try {
    const result = await schemaValidator.validateAsync(req.body);

    const emailRecord = await User.findOne({ email: result.email });
    if (emailRecord) {
      return res.status(403).json({ success: false, message: `${result.email} already exists!!` });
    }

    const usernameRecord = await User.findOne({ username: result.username });
    if (usernameRecord) {
      return res.status(409).json({ success: false, message: `${result.username} already exists!!` });
    }

    const salt = await bcrypt.genSalt(10);
    result.password = await bcrypt.hash(result.password, salt);

    result.emailToken = jwt.sign({ email: result.email }, TOKEN_KEY, { expiresIn: "2h" });

    const userObj = new User(result);
    const insertUser = await userObj.save();

    if (insertUser) {
      const accessToken = jwt.sign(
        { email: insertUser.email, id: insertUser._id },
        `${insertUser._id}+${TOKEN_KEY}`,
        { expiresIn: "1h" }
      );

      insertUser.accessToken = accessToken;
      await insertUser.save();

      res.status(200).json(insertUser);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser };
