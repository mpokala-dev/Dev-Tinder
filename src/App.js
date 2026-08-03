console.log("Hello, DevTinder!");
const express = require("express");
const connectDB = require("./config/database");
const { getMaxListeners } = require("./models/user");
const User = require("./models/user");
const app = express();

connectDB
  .then((req, res) => {
    console.log("Database connection established...");
    // Server should start listening to any requests only after connecting to the Database first.
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed...", err);
  });

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Dhanvith",
    lastName: "Dangeti",
    email: "dhanvith@gmail.com",
    password: "asd",
  };
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User details saved successfully");
  } catch (error) {
    console.error("Error occurred while saving user details:", error.message);
    res.status(400).send("Bad Request: Unable to save user details");
  }
});
