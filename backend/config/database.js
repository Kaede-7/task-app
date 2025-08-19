const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB = () => {
  mongoose
    .set("strictQuery", false)
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`Successfully connected to the database: ${process.env.MONGODB_URL}`);
    })
    .catch((err) => {
      console.log(`Database Connection Failed!!`);
      console.log(err);
    });
};

module.exports = ConnectDB;
