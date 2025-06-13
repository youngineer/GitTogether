const mongoose = require('mongoose');
const { DEFAULT_USER_PHOTO_URL } = require('../utils/constants');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isURL } = require('validator/lib/isURL');
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        validate(value) {
            const regex = /^[a-zA-Z]{4,}$/;
            if(!regex.test(value)) {
                throw new Error('Invalid first name. It must be at least 4 characters long and can only contain letters and numbers.');
            }
        }
    },
    lastName: {
        type: String,
        trim: true,
        validate(value) {
            const regex = /^[a-zA-Z0-9]{4,}$/;
            if(!regex.test(value)) {
                throw new Error('Invalid first name. It must be at least 4 characters long and can only contain letters and numbers.');
            }
        }
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender entered");
            }
        }
    },
    photoUrl: {
        type: String,
        default: DEFAULT_USER_PHOTO_URL,
        validate(value) {
            if(!isURL(value)) {
                throw new Error("Invalid photo url");
            }
        }
    },
    about: {
        type: String,
        default: "This is the default information about the user"
    },
    skills: {
        type: [String]
    }
},
{ timestamps: true });

userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({ _id: user._id}, "GitTogether@123");
    return token;
};


userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);
module.exports = { 
    User 
};