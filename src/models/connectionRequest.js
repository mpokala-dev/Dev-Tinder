const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
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

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("Cannot send request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
