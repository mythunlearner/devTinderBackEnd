const express = require("express");
const {validateUserDetails} = require("../utils/validation");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const authRouter = express.Router();


authRouter.post("/signUp", async(req,res)=> {
  console.log("SignUp User !!");
  //Vlidation
  validateUserDetails(req);
  //encryption
  const passwordenc =  bcrypt.hashSync(req.body.password, 10);

  //create new user Object
  try{
   const {firstName, lastName, emailId, password = passwordenc, age,gender} = req.body;
   const userdata = new user({firstName, lastName, emailId, password: passwordenc, age,gender});
   await userdata.save();
   res.send("User data Saved Successfully!!");
  } catch(error){
    res.status(400).send("Error occcured on SaveUser !!!" + error);
  }
  
});


authRouter.post("/login", async(req,res)=>{
  console.log("User Login");
  try{
    const{emailId,password} = req.body;
    const userDetails = await user.findOne({emailId: emailId});
    if(!userDetails){
      throw new Error("Invalid Credentials!!");
    }
    const isPasswordValid = await  userDetails.validatePassword(password);
    if(!isPasswordValid){
      throw new Error("Invalid Credentials!!");
    }
    //Generate Jwt token
     const token = await userDetails.getJWT();
 
     //Assign token to a cookie
     res.cookie("token",token, {expires: new Date(Date.now() + 1*3600000)});
     res.send("User Logged in Successfully!!")
  }catch(err){
    res.status(400).send("Error occured on Login !!"+ err) ;
  }

});


module.exports = authRouter;