const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        min: 1,
        max: 50
    }, 
    lastName: {
        type: String,
        min: 1,
        max: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true
    }, 
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: function(value) {
            value = value.toLowerCase();
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Unexpected gender type");
            }
        }
    }
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

module.exports = User;