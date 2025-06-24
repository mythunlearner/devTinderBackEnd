const express = require("express");
const {userauth} = require("../middlewares/auth");
const profileRouter = express.Router();


profileRouter.get("/profile",userauth, async(req,res)=>{
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


module.exports = profileRouter;