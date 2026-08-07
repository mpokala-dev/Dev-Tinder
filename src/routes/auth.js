const express = require("express");

const bcrypt = require("bcrypt");

const { isEmail } = require("validator");
const {
  userDataValidationOnSignUpAndUpdate,
  validateSignup,
} = require("../utils/validations");
const User = require("../models/user");
const authRouter = express.Router();

// signup user API
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    validateSignup(req);

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
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isEmail(email)) {
      throw new Error("Invalid email address");
    } else {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new Error("Invalid Credentials");
      } else {
        const isPasswordMatched = await user.validatePassword(password);

        if (isPasswordMatched) {
          const token = await user.getJWT();

          res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 3600000),
          }); // cookie expires in 7 days

          res.send("User Login Successfull!!");
        } else {
          res.status(400).send("Invalid Credentials");
        }
      }
    }
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

module.exports = authRouter;
