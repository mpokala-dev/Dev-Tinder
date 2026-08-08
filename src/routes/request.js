const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

// API that I can send as sender -> send interest or ignore a request
requestRouter.post(
  "/request/send/:status/:userId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const toUserId = req.params.userId;
      const fromUserId = req.user._id; // loggedin user id
      const sendRequestStatus = req.params.status;

      const ALLOWED_STATUS = ["ignored", "interested"];

      if (!ALLOWED_STATUS.includes(sendRequestStatus)) {
        return res.status(400).send("Invalid status type");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).send("User does not exist");
      }
      //check if sender request id === receiver request id
      // schema.pre("save", callback) verifies this every single time before the save is performed on connectRequest Collection.
      const doesConnectExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (doesConnectExist) {
        return res
          .status(400)
          .json({ message: "Connect Request already exists" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status: sendRequestStatus,
      });
      await connectionRequest.save();
      let requestedStatusMsg = "-";
      switch (sendRequestStatus) {
        case "interested":
          requestedStatusMsg = "sent request successfully to";
          break;
        case "ignored":
          requestedStatusMsg = "ignored the request of";
          break;
      }
      return res.json({
        message: `${req.user.firstName} ${requestedStatusMsg} ${toUser.firstName}`,
        data: connectionRequest,
      });
    } catch (error) {
      res.status(500).send("Something went wrong. " + error.message);
    }
  },
);

// API that I receive as loggedin user/ receiver -> send accepted or rejected a request received
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const { status, requestId } = req.params; // requestId is the _id created for the connection Request by the MongoDB
      const loggedinUser = req.user;

      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).send("Invalid status type");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, // validating the connection request by checking if any connection with the requestId exists
        toUserId: loggedinUser._id, //&& validating logged in user === toUserId of the request sent
        status: "interested", // && if status sent from the sender is in ignored status, no action can be taken. else if in interested then the connection request receiver can review and mark the status to accepted or rejected.
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request does not exists" });
      }
      connectionRequest.status = status;
      const reviewedConnectionRequest = await connectionRequest.save();
      let reviewedStatusMsg = "-";
      switch (status) {
        case "accepted":
          reviewedStatusMsg = "accepted the request";
          break;
        case "rejected":
          reviewedStatusMsg = "rejected the request";
          break;
      }
      return res.json({
        message: `${req.user.firstName} ${reviewedStatusMsg}.`,
        data: reviewedConnectionRequest,
      });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  },
);

module.exports = requestRouter;
