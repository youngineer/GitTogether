const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestRouter = express.Router();


//Dummy sendConnection request
requestRouter.post("/user/sendConnection", userAuth, async(req, resp) => {
  const user = req.user;
  resp.send(user.toString());
})


module.exports = requestRouter;