const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post(
  "/sendConnectRequest",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const { user } = req;
      res.send(user.firstName + " sent connection request");
    } catch (error) {
      res.status(500).send("ERROR: " + error.message);
    }
  },
);

module.exports = requestRouter;
