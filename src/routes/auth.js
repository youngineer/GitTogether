const express = require("express");
const { signupValidation } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");


// User Signup
authRouter.post("/signup", async (req, resp) => {
  try {
    signupValidation(req); //user data validation

    // password encryptor
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });

    const userSavedResponse = await user.save();
    const token = user.getJWT();
    resp.cookie("token", token);
    
    resp.json({
      message: "User saved successfully!",
      data: userSavedResponse
    });
    
  } catch (error) {
    resp.status(400).json({
      message: "Error saving the user:" + error.message,
      data: []
    });
  }
});


// Login
authRouter.post("/login", async (req, resp) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = user.getJWT();
    resp.cookie("token", token);
    resp.json({
      data: user
    });
  } catch (err) {
    resp.status(400).send("Something went wrong: " + err.message);
  }
});


authRouter.post("/logout", async(req, resp) => {
  resp.cookie("token", null, {
    expiresIn: new Date(Date.now()),
  });

  resp.send("Logout successful!");
});


module.exports = authRouter;