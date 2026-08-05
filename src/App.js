console.log("Hello, DevTinder!");
const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const {
  userDataValidationOnSignUpAndUpdate,
  validateSignup,
} = require("./utils/validations");
const { isEmail } = require("validator");
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
// API Level Validation

// signup user API
app.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (userDataValidationOnSignUpAndUpdate(user, "create")) {
      await user.save();
      res.send("User details saved successfully");
    } else {
      throw new Error("Cannot Create User Profile with requested details");
    }
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
  }
});
// login user API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      throw new Error("Invalid email address");
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User not found");
      } else {
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (isPasswordMatched) {
          res.send("User Login Successfull!!");
        } else {
          res.status(401).send("Password Incorrect");
        }
      }
    }
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});
// find user API
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
// fetch ALL users API
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
// fetch user by ID
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
// find user by ID and delete
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
// logic for updating user by userId from request body / request params
app.patch("/user{/:id}", async (req, res) => {
  try {
    const userId = req.params?.id ?? req.body._id;

    if (!userDataValidationOnSignUpAndUpdate(req.body)) {
      throw new Error(
        "Update is not allowed in one or all of the requested fields",
      );
    }
    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
    });
    if (!updateUser) {
      res.status(404).send("User not found");
    } else {
      console.log("User updated successfully" + updateUser);
      res.send("User updated successfully");
    }
  } catch (error) {
    console.log("Error occurred while updating user:", error.message);
    res
      .status(500)
      .send(
        "Internal Server Error: Something went wrong while updating user" +
          error.message,
      );
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
