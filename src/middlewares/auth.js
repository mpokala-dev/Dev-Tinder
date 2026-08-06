const { SCECRET_KEY } = require("../config/env");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  const adminAuthToken = "my-secret-token";
  const isAuthorized = adminAuthToken === "my-secret-token";
  if (!isAuthorized) {
    return res.status(401).send("Unauthorized access");
  }
  console.log("Authorized Admin login");
  next();
};

const userAuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token. Please login again.");
    }
    const decoded = await jwt.verify(token, SCECRET_KEY);
    const { _id } = decoded;
    if (!_id) {
      throw new Error(401).send("Unauthorized User");
    }
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User not found");
    } else {
      console.log("Autorized User access");
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send("ERROR:: " + error.message);
  }
};

module.exports = {
  adminAuthMiddleware,
  userAuthMiddleware,
};
