const express = require("express");
const { userDataValidationOnUpdate } = require("../utils/validations");
const User = require("../models/user");
const { userAuthMiddleware } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

const profileRoute = express.Router();

// user profile details
profileRoute.get("/profile/view", userAuthMiddleware, (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "ERROR: " + error.message });
  }
});

// update user profile (by fetching id from cookies)
profileRoute.patch("/profile/update", userAuthMiddleware, async (req, res) => {
  try {
    const { _id } = req.user;

    if (!userDataValidationOnUpdate(req.body)) {
      return res.status(400).send({
        message: "Update is not allowed in one or all of the requested fields",
      });
    }
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      returnDocument: "after",
    });
    if (!updateUser) {
      return res.status(404).send({ message: "User not found" });
    } else {
      return res.json({
        message: "User updated successfully",
        data: updateUser,
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "Internal Server Error: Something went wrong while updating user" +
        error.message,
    });
  }
});

// password reset API
profileRoute.patch("/passwordReset", userAuthMiddleware, async (req, res) => {
  try {
    const loggedinEmail = req.user;
    const { email, password } = req.body; // user must enter the signed in email and the new password to reset | logged in user will anyways have their email on req.user
    const userEmail = loggedinEmail?.email ?? email;
    if (!userEmail) {
      throw new Error(" User Email Invalid");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findOneAndUpdate(
        { email: userEmail },
        { password: hashedPassword },
        { returnDocument: "after" },
      );
      res.clearCookie("token");
      res.json({
        message: "Password Reset Successful. Please login again. ",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong, please try again. " + error.message,
    });
  }
});

module.exports = profileRoute;
