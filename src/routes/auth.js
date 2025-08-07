const express = require("express");
const {validateUserDetails} = require("../utils/validation");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const authRouter = express.Router();
const {userauth} = require("../middlewares/auth");


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
     res.send(userDetails);
  }catch(err){
    res.status(400).send("Error occured on Login !!"+ err) ;
  }

});


authRouter.post("/logout", userauth, async(req,res) => {
    res.cookie("token",null, {expires: new Date(Date.now())});
    res.send("User Logged off Successfully!!!");
  });

authRouter.patch("/forgotPassword",async(req,res) => {
 try{
  console.log(req.body);
   const {emailId}= req.body;
    console.log("emailID: "+ emailId);
   const userDetail = await user.findOne({emailId: emailId});
   console.log("[["+userDetail);
   if(!userDetail){
    res.status(400).send("Given Email is not registered!!")
   }
   const resetCode = Math.random().toString(36).substring(2, 7).toUpperCase();
   const expiry = Date.now() + 10 * 60 * 1000;

   userDetail.resetCode = resetCode;
   userDetail.resetCodeExpiry = expiry;
   await userDetail.save(userDetail);

   res.send("Reset passcode: " + userDetail.resetCode);
 }catch(err){
  res.status(400).send("Error occured on forgotPassword !!"+ err) ;
 }
});


authRouter.patch("/resetPassword", async(req,res) => {
 try{
  const {resetCode,emailId, password} = req.body;
  const userDetail = await user.findOne({resetCode: resetCode,emailId: emailId});
  if(!userDetail){
    res.status(400).send("Token is Not valid!!")
  }
     //encrypted password
    const passwordenc =  bcrypt.hashSync(password, 10);

   userDetail.password = passwordenc;
  await userDetail.save(userDetail);
  res.send("Password Reset Success");
   
 }catch(error){
   res.status(400).send("Error in password Reset" +error);
 }  
});

module.exports = authRouter;