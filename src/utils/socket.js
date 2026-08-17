const { Server } = require("socket.io");
const Chat = require("../models/Chat");

const initializeServer = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join(".");
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({
        senderFirstName,
        senderLastName,
        userId,
        targetUserId,
        text,
        photo,
      }) => {
        try {
          const senderFullName = senderFirstName + " " + senderLastName;
          const roomId = [userId, targetUserId].sort().join(".");

          console.log("SEND FROM SOCKET:", socket.id);

          console.log("ROOM MEMBERS:", io.sockets.adapter.rooms.get(roomId));

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            senderName: senderFullName,
            sender_Id: userId,
            userId: targetUserId,
            text,
            photo,
            timestamp: new Date().toISOString(),
          });
        } catch (err) {
          console.error(err);
        }
      },
    );
    socket.on("disconnect", () => {
      console.log("DISCONNECTED");
    });
  });
};

module.exports = { initializeServer };
