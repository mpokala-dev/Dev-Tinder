const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const Chat = require("../models/Chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuthMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chatMessages = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });

    if (!chatMessages) {
      chatMessages = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chatMessages.save();
    }

    res.json(chatMessages);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

module.exports = chatRouter;
