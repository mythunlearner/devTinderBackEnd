const mongoose = require("mongoose");
const validator = require("validator");

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

const user =  mongoose.model("user",userSchema);

module.exports = user;