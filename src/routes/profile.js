const express = require("express");
const { User } = require("../models/user");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();

// Feed: Fetch all users
profileRouter.get("/profile/feed", userAuth, async (req, resp) => {
  try {
    const users = await User.find({}); //returns array of all users available
    if(users.length === 0) {
      resp.status(404).send("No users found");
    } else {
      resp.send(users.toString());
    }
  } catch (err) {
      resp.status(400).send("Something went wrong");
  }
});


// Edit user 
profileRouter.patch("/profile/edit/:userId", userAuth, async(req, resp) => {
  const id = req.params?.userId;
  const updatedData = req.body;
  let userToUpdate = null;

  try {
    const isValidUpdation = Object.keys(updatedData).every((k) => {
      return ALLOWED_UPDATES.includes(k);
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


module.exports = profileRouter;