console.log("Hello, DevTinder!");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRoute = require("./routes/request");
const userRouter = require("./routes/user");

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
app.use(cookieParser());
/* API Level Validation */

app.use("/", authRouter); // signup user API // login user API // logout user API

app.use("/", profileRouter); // profile API - logic for view/updating/reset password

app.use("/", requestRoute); // send and review connection request APIs

app.use("/", userRouter); // get pending requests API

// find user from req.body API  <- Admin | search api
app.get("/users", async (req, res) => {
  const userDetails = req.body;
  try {
    const users = await User.find(userDetails);
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
// fetch ALL users API <- Admin | feed api
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
// fetch user by ID <- Admin
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
// find user by ID and delete <- Admin
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body?._id ?? null;
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    console.log("Error occurred while deleting user:", error.message);
    res
      .status(500)
      .send("Internal Server Error: Something went wrong while deleting user");
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
