// console.log("Om Namo Bhagavate Vasudevaaya!");
const express = require("express"); // importing express module
const app = express(); // creating express instance and naming it "app"

app.use("/test", (req, resp) => {
    resp.send("Hello from test");
});

app.use("/hello", (req, resp) => {
    resp.send("hello from hello!");
});

app.listen(3000, () => {
  console.log(`app.js listening on port 3000`)
}) // the app express instance is listening to requests on port 3000
