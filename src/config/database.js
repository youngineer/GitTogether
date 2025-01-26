const mongoose = require("mongoose");
const express = require("express");

const connectDb = async() => {
    await mongoose.connect(
        "mongodb+srv://youngineer:iukpzagq2Gh89nFZ@learnnodejs.8emnc.mongodb.net/gitTogether"
    );
};

module.exports = connectDb;
