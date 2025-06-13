const validator = require('validator');


function signupValidation(data) {
    const { firstName, lastName, emailId, password } = data.body;

    if(!firstName || !lastName) {
        throw new Error("Please enter name");
    } else if (firstName.length < 4 || lastName.length > 50 || firstName.length > 50) {
        throw new Error("Invalid lastname");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email");
    } 
};


module.exports = {
    signupValidation
}