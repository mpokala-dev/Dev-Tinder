const express = require("express");

const bcrypt = require("bcrypt");

const { isEmail } = require("validator");
const {
  validateSignup,
  userDataValidationOnSignup,
} = require("../utils/validations");
const User = require("../models/user");
const authRouter = express.Router();

// signup user API
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    validateSignup(req);

    if (userDataValidationOnSignup(req.body)) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

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

          res.json({ message: "User Login Successfull!!", data: user });
        } else {
          res.status(400).send("Invalid Credentials");
        }
      }
    }
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// logout user API
authRouter.post("/logout", async (req, res) => {
  try {
    // res.cookie("token", null, { expires: new Date(Date.now()) });
    res.clearCookie("token");
    res.send("User logged out successfully");
  } catch (error) {
    res
      .status(500)
      .send("Internal Server Error: Unable to logout " + error.message);
  }
});

module.exports = authRouter;
