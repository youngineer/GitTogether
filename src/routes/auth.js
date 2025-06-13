const express = require("express");
const { signupValidation } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");


// User Signup
authRouter.post("/signup", async (req, res) => {
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

    await user.save()
      .then(() => {
        res.send("User Added successfully!");
      }).catch(err => {
        res.status(400).send("Error saving the user:" + err.message);
      })
    
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
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
    resp.send("Login successful!");
  } catch (err) {
    resp.status(400).send("Login unsuccessful!");
  }
});


module.exports = authRouter;