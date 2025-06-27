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

const validateUserProfileDetailEdit =(req) => {
  const userFields = ["firstName","lastName","emailId","age","gender","photoUrl","about", "skills"];
  const isValidUserProfile =  Object.keys(req.body).every((key)=>userFields.includes(key));
 return isValidUserProfile;
};
module.exports = {validateUserDetails, validateUserProfileDetailEdit};