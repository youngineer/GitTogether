const express = require("express");
const connectDb = require("./config/database");
const server = express();
const User = require("./models/user");

// Middleware to parse JSON
server.use(express.json());

connectDb()
    .then(() => {
        console.log("Connection established with database!"); // always establish db connection first
        server.listen(7777, () => {
            console.log("Server listening on port 7777...");
        });
    })
    .catch((err) => {
        console.error("Connection failed!");
    });

// Signup endpoint
server.post("/signup", async (req, resp, next) => {
    console.log(req.body);
    const user = new User(req.body);

    try {
        await user.save();
        resp.send("User added successfully to: GitTogether");
    } catch (err) {
        resp.status(404).send(`Error sending data: ${err.message}`);
    }
});

// Get the oldest user with the requested email
server.get("/user", async (req, resp) => {
    try {
        const reqEmail = req.body.email; 
        const user = await User.findOne({ email: reqEmail });

        if (!user) {
            return resp.status(404).send(`User with email ${reqEmail} not found`);
        }
        resp.send(user);
    } catch (error) {
        resp.status(500).send(`Error fetching user: ${error.message}`);
    }
});

// Get all users
server.get("/feed", async (req, resp) => {
    try {
        const userList = await User.find({});
        if (userList.length === 0) {
            return resp.status(404).send("No users found");
        }
        resp.send(userList);
    } catch (err) {
        resp.status(500).send(`Error fetching all users: ${err.message}`);
    }
});


server.put("/user/findOneAndUpdate", async (req, resp) => {
    const userObj = {
        firstName: "Shri Abdul",
        lastName: "Kalam",
        email: "abdul@kalam.com",
        password: "RameshwaramAbdulKalam"
    };

    try {
        const rEmail = req.body.email;
        const updatedUser = await User.findOneAndUpdate(
            { email: rEmail },  
            userObj,             
            { new: true },
            { runValidators: true }       
        );

        if (!updatedUser) {
            return resp.status(404).send(`User with email ${rEmail} not found`);
        }

        resp.send(updatedUser);
    } catch (error) {
        resp.status(500).send(`Error updating user: ${error.message}`);
    }
});

