const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

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
        return res.json({
          message: "There are no pending requests.",
          data: pendingConnectionRequests,
        });
      }
      res.json({
        message: "Data fetched successfully",
        data: pendingConnectionRequests,
      });
    } catch (error) {
      res.status(500).send({ message: "Error: " + error.message });
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
        data: activeConnections,
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
    res.status(500).send({ message: "Error: " + error.message });
  }
});

//users feed
userRouter.get("/user/feed", userAuthMiddleware, async (req, res) => {
  try {
    const loggedinUser = req.user;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit; // limit is limited to 20 or less so that API would not lag DB performance by fetching huge sets of data
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const hideUsersFromFeed = new Set();
    const connections = await ConnectionRequests.find({
      $or: [{ toUserId: loggedinUser._id }, { fromUserId: loggedinUser._id }],
    });

    connections.length > 0 &&
      connections.forEach((connection) => {
        hideUsersFromFeed.add(connection.toUserId.toString());
        hideUsersFromFeed.add(connection.fromUserId.toString());
      });

    const usersFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedinUser._id } },
      ],
    })
      .select("firstName lastName about age skills location gender photoUrl")
      .skip(skip)
      .limit(limit);
    res.json({
      message: `${loggedinUser.firstName} has ${usersFeed.length} feed(s) to view`,
      data: usersFeed,
    });
  } catch (error) {
    res.status(400).send({ message: "Error:: " + error.message });
  }
});
module.exports = userRouter;
