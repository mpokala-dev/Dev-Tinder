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
      }).populate(
        ["fromUserId", "toUserId"],
        [
          "firstName",
          "lastName",
          "age",
          "gender",
          "skills",
          "localtion",
          "photoUrl",
          "about",
        ],
      );
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

// connections established
userRouter.get("/user/connections", userAuthMiddleware, async (req, res) => {
  try {
    const loggedinUser = req.user;

    // ConnectionRequests.find($or: [{ status: "accepted",fromUserId: loggedinUser._id }, { status: "accepted",toUserId: loggedinUser._id }])

    const activeConnections = await ConnectionRequests.find({
      $or: [{ fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }],
      status: "accepted",
    }).populate(
      ["fromUserId", "toUserId"],
      "firstName lastName age skills about gender location photoUrl",
    );
    let data = activeConnections;
    if (activeConnections.length == 0) {
      return res.json({
        message: `${loggedinUser.firstName} do not have any active connections yet!`,
      });
    }
    data = activeConnections.map((obj) => {
      if (obj.fromUserId._id.equals(loggedinUser._id)) {
        return obj.toUserId;
      }
      return obj.fromUserId;
    });

    return res.json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = userRouter;
