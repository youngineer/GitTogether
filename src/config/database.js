const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
    "mongodb+srv://youngineer:Luj25663@namastenode.4ctgdzt.mongodb.net/GitTogether"
    ).then(() => {
        console.log("Database successfully connected!");
    }).catch(err => {
        console.error(`${err} occured`);
    })
};


module.exports = {
    connectDB
};
