console.log("Hello, DevTinder!");
const express = require("express");
const app = express();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/user", (req, res) => {
  res.send("User Logged in successfully");
});
app.post("/user", (req, res) => {
  res.send(
    "Post user data with {firstName:'Alexa', lastName:'Amazon'} is successfull",
  );
});
app.patch("/user", (req, res) => {
  res.send("User data updated with {type: 'voice assistant'} successfully");
});
app.delete("/user", (req, res) => {
  res.send("User data deleted successfully");
});
app.use("/", (req, res) => {
  res.send("Sample route");
});
