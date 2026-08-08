const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");

const userRouter = express.Router();
// request received by user that are pending review
userRouter.get(
  "/user/requests/received",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const pendingConnectionRequests = await ConnectionRequests.find({
        toUserId: loggedinUser._id,
        status: "interested",
      }).populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "localtion",
        "photoUrl",
        "about",
      ]);
      if (pendingConnectionRequests.length == 0) {
        return res.json({ message: "There are no pending requests." });
      }
      res.json({
        message: "Data fetched successfully",
        data: pendingConnectionRequests,
      });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  },
);

module.exports = userRouter;
