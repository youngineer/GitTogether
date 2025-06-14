const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["interested", "rejected", "ignored", "accepted"],
        message: `{VALUE} is invalid for the status type`
    }
},
{ timestamps: true } );


connectionRequestSchema.pre("save", function (next) {
  const connection = this;

  if (connection.fromUserId.equals(connection.toUserId)) {
    return next(new Error("You cannot send a request to yourself!"));
  }

  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // compound indexing to optimise query

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest", 
    connectionRequestSchema
);


module.exports = { ConnectionRequest };