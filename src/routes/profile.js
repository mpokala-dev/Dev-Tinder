const express = require("express");
const { userDataValidationOnSignUpAndUpdate } = require("../utils/validations");
const User = require("../models/user");
const { userAuthMiddleware } = require("../middlewares/auth");

const profileRoute = express.Router();

// user profile details
profileRoute.get("/profile", userAuthMiddleware, (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

// update user profile by Id
profileRoute.patch("/profile{/:id}", userAuthMiddleware, async (req, res) => {
  try {
    const { _id } = req.user;
    const userId = _id || req?.params?.id;

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

// logout user API
profileRoute.post("/logout", userAuthMiddleware, async (req, res) => {
  try {
    res.clearCookie(token);
    res.send("User logged out successfully");
  } catch (error) {
    res
      .status(500)
      .send("Internal Server Error: Unable to logout " + error.message);
  }
});

module.exports = profileRoute;
