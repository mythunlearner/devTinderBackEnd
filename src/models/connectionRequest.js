const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId
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
    }

},
{timestamps:true});

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

