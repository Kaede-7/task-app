const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    accessToken: { type: String },
    emailToken: { type: String },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
