const express = require('express');
const connectionRequest = require('../models/connectionRequest');
const user = require('../models/user');
const {userauth} = require("../middlewares/auth");
const userRouter = express.Router()
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about"
/*
This method will show the connections received from a multiple peoples to user
*/
userRouter.get('/user/requests/received', userauth,async (req, res) => {
    try{
        const loggedInUserId= req.user._id;
        console.log("Logged in user ID: " + loggedInUserId);
        const connRequest = await connectionRequest.find({toUserId: loggedInUserId, status: "interested"
            
        }).populate('fromUserId', USER_SAFE_DATA);
        if(!connectionRequest || connectionRequest.length === 0){
            return res.status(404).json({message: "No connection requests found"});
        }
        res.json({message: "Connection requests found", connRequest});

    }catch(error) {
        res.status(400).send("Error occured on ConnectionRequest retrival !!!" + error);
    }

});

userRouter.get('/user/connections', userauth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        console.log("Inside get conncetion");
        const connRequest = await connectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId","firstName lastName photoUrl age gender about");

        const userData = connRequest.map((row) =>{
           if(row.fromUserId.toString() == loggedInUser._id.toString()){
            return row.toUserId;
           }
           return row.fromUserId;
        });

        res.json({data: userData});
        
       

    }catch(error) {
        res.status(400).send("Error occured on Connection retrival !!!" + error);
    }
});


userRouter.get('/feed',userauth, async(req,res) =>{
    try{
        console.log("Feed");
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;
        const loggedInuser = req.user;
        // console.log("loggedInuser._id" + loggedInuser._id);
        // get details of users who send and receive connection. 
        const connectionUser = await connectionRequest.find({
            $or:[{fromUserId: loggedInuser._id},
                {toUserId: loggedInuser._id}
            ]
        }).select("fromUserId toUserId");
        // console.log("connectionUser" + connectionUser);
         //Removing Duplicate record 
        const hideUserFromFeed = new Set();
        connectionUser.forEach((req) =>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });
console.log("Page: " + skip + "Limit: " + limit);
        const users = await user.find({
            $and:[
                {_id:{$nin: Array.from(hideUserFromFeed)}},
                {_id:{$ne: loggedInuser._id}}
            ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        
        res.json({data: users});

    }catch(error){
        res.status(400).send("Error occured on feed collection" + error);
    }
})
module.exports = userRouter