const express = require("express");
const { registerUser } = require("../Controller/userRegisterController");

const userRegisterRouter = express.Router();

userRegisterRouter.post("/register", registerUser);

module.exports = userRegisterRouter;
