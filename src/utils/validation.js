const validator = require("validator");
const validateUserDetails =  (req) =>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName|| !lastName) {
        throw new Error("First Name and Last Name are required fields");
    }
    if(!emailId || !validator.isEmail(emailId)) {
        throw new Error("Valid Email ID is required");
    }
    if(!password || !validator.isStrongPassword(password)) {
        throw new Error("Strong Password is required");
    }
};

module.exports = {validateUserDetails};