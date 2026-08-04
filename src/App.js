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
app.use(express.json());
app.post("/signup", async (req, res) => {
  const userObj = req.body;
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User details saved successfully");
  } catch (error) {
    console.error("Error occurred while saving user details:", error.message);
    res.status(400).send("Bad Request: Unable to save user details");
  }
});
app.get("/users", async (req, res) => {
  const userDetails = req.body;
  console.log("/users", req.body);
  try {
    const users = await User.find(userDetails);
    console.log("Users found:", users);
    if (users.length === 0) {
      return res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (error) {
    console.error("Error occurred while fetching users:", error.message);
    res
      .status(500)
      .send("Internal Server Error: Something went wrong while fetching users");
  }
});
app.get("/users/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).send("User not found");
    } else {
      console.log(users.length);
      res.send(users);
    }
  } catch (error) {
    console.log("Error occurred while fetching users:", error.message);
    res.status(500).send("Something went wrong while fetching users");
  }
});
app.get("/userById", async (req, res) => {
  const userId = req.body?._id ?? null;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    console.log("Error occurred while fetching user:", error.message);
    res.status(500).send("Something went wrong while fetching user");
  }
});
app.use("/", (err, req, res, next) => {
  res
    .status(500)
    .send(
      "Internal Server Error: Invalid Request or Response data received" +
        err.message,
    );
});
