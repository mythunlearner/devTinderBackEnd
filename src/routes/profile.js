const express = require("express");
const {userauth} = require("../middlewares/auth");
const {validateUserProfileDetailEdit} = require("../utils/validation");
const profileRouter = express.Router();


profileRouter.get("/profile/view",userauth, async(req,res)=>{
  try{
 //User profile
  const user = req.user;
  
  if(!user){
    throw new Error("User Does not exist");
  }
  res.send(user);
  }catch(err){
    res.status(400).send("Error"+ err);
  }

});

profileRouter.patch("/profile/edit",userauth, async(req,res) => {
  try{

   if(!validateUserProfileDetailEdit(req)){
     throw new Error("Invalid Edit Request!!");
   }
   const loggedinUser = req.user;
   console.log(loggedinUser);
   Object.keys(req.body).forEach((keys)=> loggedinUser[keys]=req.body[keys]);
   console.log("After: "+ loggedinUser);
   await loggedinUser.save();
   res.send(`${loggedinUser.firstName}, your profile updated Successfully`);
  }catch(error){
     res.status(400).send("Error in User Edit" + error);
  }

});

module.exports = profileRouter;