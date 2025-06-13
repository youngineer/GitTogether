const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async(req, resp, next) => {
    try {
        const { token } = req.cookies;
        const decodedToken = await jwt.verify(token, "GitTogether@123");
        const userId = decodedToken._id;
        const user = await User.findById({ _id: userId });

        if(!user) {
            resp.status(404).send("Login again please");
        } else {
            req.user = user;
            next();
        }
    } catch(err) {
        resp.status(400).send("Something went wrong: " + err.message);
    }

};


module.exports = {
    userAuth
}