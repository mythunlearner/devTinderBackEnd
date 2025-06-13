const mongoose = require("mongoose");

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
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    age: {
        type: Number
        
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