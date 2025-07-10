const express  = require("express");
const requestRouter = express.Router();
const {userauth} = require("../middlewares/auth");
const conncectionRequest = require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:toUserId",userauth, async(req, res)=>{
    console.log("inside request");
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        console.log("User" + req.user);
        const toUser = await conncectionRequest.findOne({toUserId:toUserId});
        if(!toUser){
            return res.status(400).json({message: "User is not available"});
        }

        const allowedStatus = ["intrested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: "+ status});
        }

        const existingConnectionRequest = await conncectionRequest.findOne(
            {
                $or:[
                    {fromUserId, toUserId},
                    {fromUserId: toUserId, toUserId: fromUserId}
                ]
            }
        );

        if(existingConnectionRequest){
            return res.status(400).json({message: "Connection Request Already Exist for this user"});
        }

        const conRequest  = new conncectionRequest({fromUserId,toUserId,status});
       const saveUser =  await conRequest.save();
        res.json({message: req.user.firstName+ "is" + status + "in" + toUser.user.firstName, saveUser});
    }catch(error){
        res.status(400).send("Error occcured on ConnectionRequest !!!" + error);
    }
});


requestRouter.post("/request/review/:status/:requestId", userauth, async(req,res)=> {
    try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
        return status(404).json({message: "Status not allowed !"});
    }
    const connectionRequestUser = await conncectionRequest.findOne({_id: requestId, toUserId: loggedInUser._id, status: "interested"});
    if(!connectionRequestUser){
        return res.status(404).json({message: "Connection request not found"});
    }

    connectionRequestUser.status = status;
    const resData = await connectionRequestUser.save();

    res.json({message: "Connection request " + status , resData});


    }catch(error){
    res.status(400).send("ERROR "+ error.message);
    }
});

module.exports = requestRouter