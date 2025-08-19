const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/static", express.static(path.join(__dirname, "../frontend")));

app.post('/login',(req,res) =>{
  const message = req.body;
  console.log(message);
  return res.json({
    success : true,
    message : "Login successful"
  })
});

app.put('/api/password/:id',(req,res) => {

  const id = req.params.id
console.log(id);
  if (id != '1') {
    return res.status(401).send("params id must be 1");
  }

  if (req.body.newPassword != req.body.confirmPassword) {
    return res.status(400).send("Enter the same password");
  }

  res.status(200).send("Password changed")
})

app.get('/logout',(req,res) => {
  res.send("Logged Out")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
