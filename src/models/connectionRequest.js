const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",//Reference to User model
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: {
            values: ["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        }
    },
    fromUserName:{
        type: String
    },
    toUserName: {
        type: String
    }

},
{timestamps:true});
//CompundIndex to retrive the data quick (i,e adding index )
connectionRequestSchema.index({fromUserId: 1,toUserId: 1});
connectionRequestSchema.pre("save", function(next){
 const conncectionReq = this;
 //check if the fromUserID is same as toUserID
 if(conncectionReq.fromUserId.equals(conncectionReq.toUserId)){
    throw new Error("cannot Send Connection request to yourself!!");
 }
 next();
});


const conncectionRequest =  mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = conncectionRequest;

