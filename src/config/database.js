const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        process.env.DB_CONNECTION_URL
    ).then(() => {
        console.log("Database successfully connected!");
    }).catch(err => {
        console.error(`${err} occured`);
    })
};


module.exports = {
    connectDB
};
