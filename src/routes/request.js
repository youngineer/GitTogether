const express = require("express");
const { userAuth } = require("../middleware/auth");
const { User } = require("../models/user");
const { ConnectionRequest } = require("../models/connectionRequest");
const requestRouter = express.Router();


//Dummy sendConnection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, resp) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;

  const allowedStatus = ["interested", "ignored"];
  if(!allowedStatus.includes(status)) {
    return resp.status(400).json({
      message: "invalid status"
    });
  }

  // check if the user is in the User database
  const fromUser = await User.findById(fromUserId);
  const toUser = await User.findById(toUserId);

  if(!fromUser || !toUser) {
    return resp.status(404).json({
      message: "User not found"
    });
  };


  // check if either user has already sent connection request
  const alreadyConnected = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId }
    ]
  });

  if(alreadyConnected) {
    return resp.status(400).json({
      message: "Connection already established"
    });
  }

  const connection = new ConnectionRequest({
    fromUserId,
    toUserId,
    status
  });
  const data = await connection.save();

  resp.status(201).json({
    message: "Connection request sent",
    body: data
  });

});


requestRouter.post("/request/review/:status/:connectionRequesterId", userAuth, async(req, resp) => {
  try {
    const loggedInUser = req.user;
    const { status, connectionRequesterId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if(!allowedStatus.includes(status)) {
      return resp.status(400).json({
        message: "Status is not acceptable"
      });
    };

    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId: connectionRequesterId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if(!connectionRequest) {
      return resp.status(404).json({
        message: "Request not found",
        body: []
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    console.log(data)

    resp.status(201).json({
      message: "Connection request accepted successfully!",
      body: data
    });

  } catch (err) {
    throw new Error("Something went worng: " + err.message);
  }
})


module.exports = requestRouter;