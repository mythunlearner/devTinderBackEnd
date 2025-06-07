const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    }
});

const user =  mongoose.model("user",userSchema);

module.exports = user;