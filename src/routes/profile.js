const express = require("express");
const { User } = require("../models/user");
const { userAuth } = require("../middleware/auth");
const { validateProfileEditRequest } = require("../utils/validation");
const { JsonWebTokenError } = require("jsonwebtoken");
const { ALLOWED_UPDATES, ALLOWED_PROFILE_UPDATES } = require("../utils/constants");
const { Connection } = require("mongoose");
const { ConnectionRequest } = require("../models/connectionRequest");
const profileRouter = express.Router();

// Feed: Fetch all users
profileRouter.get("/profile/feed", userAuth, async (req, resp) => {
  const loggedInUser = req.user;
  const availableUsers = [];
  const connectedUserIds = new Set();
  try {
    const allUsers = await User.find({}); //returns array of all users available
    if(allUsers.length === 0) {
      resp.status(404).json({message: "No users available now"});
    } else {
      const connectedUsers = await ConnectionRequest.find({
        $or: [
          { toUserId: loggedInUser._id  },
          { fromUserId: loggedInUser._id }
        ]
      });
      
      connectedUsers.forEach((connectedUser) => {
        connectedUserIds.add(connectedUser.fromUserId.toString());
        connectedUserIds.add(connectedUser.toUserId.toString());
      });

      allUsers.forEach((user) => {
        if(!connectedUserIds.has(user._id.toString())) {
          availableUsers.push(user);
        }
      });

      console.log("avalable:", availableUsers);
      resp.json({
        data: availableUsers
      });
    }
  } catch (err) {
      resp.status(400).json({
        message: err.message
      });
  }
});


// Edit user 
profileRouter.patch("/profile/edit/:userId", userAuth, async(req, resp) => {
  const id = req.params?.userId;
  const updatedData = req.body;
  let userToUpdate = null;

  try {
    const isValidUpdation = Object.keys(updatedData).every((k) => {
      return ALLOWED_PROFILE_UPDATES.includes(k);
    });

    if (!isValidUpdation) {
      throw new Error("Updation not allowed");
    } else {
      userToUpdate = await User.findByIdAndUpdate({_id: id}, updatedData, {
        runValidators: true,
        returnDocument: 'after'  
      });

      if (!userToUpdate) {
        resp.status(404).send("User not found");
      } else {
        resp.send("User updated successfully!");
      }
    }
  } catch (error) {
    resp.status(400).send("Something went wrong: " + error.message);
  }
});


profileRouter.patch("/profile/edit", userAuth, async(req, resp) => {
  try {
    const updatedUserData = req.body;
    const userId = req.user._id;
    if(!validateProfileEditRequest(updatedUserData)) {
      throw new Error("Edit not allowed");
    }

    const userToUpdate = await User.findByIdAndUpdate({_id: userId}, updatedUserData, {
      runValidators: true
    });
    if (!userToUpdate) {
      resp.status(404).send("User not found");
    } else {
      resp.send("User updated successfully!");
    }
  } catch (err) {
    throw new Error("Something went wrong: " + err.message);
  }
});


profileRouter.get("/profile/view", userAuth, async(req, resp) => {
  resp.status(200).json({
    data: req.user
  })
})

//TODO Forgot password
// profileRouter.post("/profile/password", async(req, resp) => {
//   const userInputData = req.body
// })

module.exports = profileRouter;