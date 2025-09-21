const express  = require("express");
const requestRouter = express.Router();
const {userauth} = require("../middlewares/auth");
const user = require("../models/user");
const conncectionRequest = require("../models/connectionRequest");
const {run: sendEmail} = require("../utils/sendEmail");
// Remove this line, it's incorrect:
// const sendEmail = request("../utils/sendEmail");

// The correct way is already present above:
// const sendEmail = require("../utils/sendEmail")

requestRouter.post("/request/send/:status/:toUserId",userauth, async(req, res)=>{
    console.log("inside request", req.body);
    console.log("inside request param" ,req.params.toUserId);
    console.log("inside request param" ,req.params.status);
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const fromUserName = req.user.firstName;
        // console.log("fromUserName: " + fromUserName);
      
      //  console.log("User" + req.user);
       const toUserDetails = await user.findOne({_id: toUserId});
      
        // console.log("toUserDetails" + toUserDetails);
        const toUserName = toUserDetails.firstName;
        //    console.log("toUserName: " + toUserName);
        if(!toUserDetails){
            return res.status(400).json({message: "User is not available"});
        }

        const allowedStatus = ["interested","ignored"];
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
 console.log("line8: ");
        const conRequest  = new conncectionRequest({fromUserId,toUserId,status,fromUserName,toUserName});
       const saveUser =  await conRequest.save();

       // send email to toUserDetails emailId
         const emailRes = await sendEmail();
         console.log("emailRes: " + emailRes);

         
        res.json({message: req.user.firstName+ "is" + status + "in" + toUserDetails.firstName, saveUser});
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
    // console.log("_id : "+ requestId + " loggedInUser: " + loggedInUser._id + " status: " + status);

    const connectionRequestUser = await conncectionRequest.findOne({_id: requestId, toUserId: loggedInUser._id, status: "interested"});
    
    // console.log("connectionRequestUser: " + connectionRequestUser);
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