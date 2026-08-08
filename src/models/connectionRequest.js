const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid request status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 }); //indexing makes the DB search faster.. over indexing by indexing unneccesary fields will decrease the DB performance

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("Cannot send request to yourself");
  }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
