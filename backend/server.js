const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

// allow all origins (for dev)
app.use(cors());

// Routes
const TaskRoute = require("./Routes/TaskRoute");
const categoryRouter = require("./Routes/categoryRouter");
const userRegisterRoute = require("./Routes/userRegisterRoute");
const userLoginRouter = require("./Routes/userLoginRoute");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "../frontend")));


// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to database."))
  .catch((err) => console.log("Couldn't connect:", err.message));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Routes
app.use("/api/tasks", TaskRoute);
app.use("/api/tasks/cat", categoryRouter);
app.use("/api/auth/register", userRegisterRoute);
app.use("/api/auth/login", userLoginRouter);

// Invalid route handler
app.use((req, res) => {
  res.status(404).json({ message: "Invalid route" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
