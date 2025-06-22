const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:4,
        maxLength:50
    },
    lastName: {
        type: String
        
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id" + value);
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough"+ value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
        
    },
    gender: {
        type: String,
         validate:{
            validator: function (value) {
                return ['Male', 'Female', 'Other'].includes(value);
            }

         }
       
    },
    photoUrl: {
        type: String,
         required: true,
         default: "This is a default about of the user Photo URL !"
    },
    about: {
        type: String,
         required: true,
        default: "This is a default about of the user !"
    },
    skills: {
        type: [String]
    }
},
{timestamps : true});

//Schema Method to generate JWT token
userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({_id:user._id},"Milan@2020",{expiresIn:"1h"});
  return token;
};

//Schema method to validate password
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

const user =  mongoose.model("user",userSchema);

module.exports = user;