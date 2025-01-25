const express = require("express");
const server = express();

server.listen(3000, () => {
    console.log("Server listening on 3000...");
});

server.use("/", (req, resp) => {
    resp.send("You are in the main page");
});

server.use("/hello", (req, resp) => {
    resp.send("Om Namo Bhagavate Vasudevaya!");
})