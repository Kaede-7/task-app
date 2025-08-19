const express = require("express");
const { validateCredentials } = require("../Controller/userLoginController");
const verifyToken = require("../middlewares/auth");

const userLoginRouter = express.Router();

userLoginRouter
  .post("/validateCredentials", validateCredentials)
  .get("/validateCredentials", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })
  .put("/validateCredentials", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })
  .delete("/validateCredentials", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  });

// Verify JWT
userLoginRouter.post("/", verifyToken);

module.exports = userLoginRouter;
