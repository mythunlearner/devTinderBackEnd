const {adminauth, userauth} = require("./middlewares/auth");
const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");
const {validateUserDetails} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser());



app.post("/signUp", async(req,res)=> {
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


app.post("/login", async(req,res)=>{
  console.log("User Login");
  try{
    const{emailId,password} = req.body;
    const userDetails = await user.findOne({emailId: emailId});
    if(!userDetails){
      throw new Error("Invalid Credentials!!");
    }
    const isPasswordValid = await bcrypt.compare(password,userDetails.password);
    if(!isPasswordValid){
      throw new Error("Invalid Credentials!!");
    }
    //Generate Jwt token
     const token = await jwt.sign({_id: userDetails._id},"Milan@2020");
      console.log("token" + token);
     res.cookie("token",token);
     res.send("User Logged in Successfully!!")
  }catch(err){
    res.status(400).send("Error occured on Login !!");
  }

});

app.get("/profile", async(req,res)=>{
  try{
  const cookie = req.cookies;
  console.log(cookie);

  const {token} = cookie;
  if(!token){
     throw new Error("Invalid Token!!");
  }
  const decodemessage = await jwt.verify(token,"Milan@2020");
  const {_id} = decodemessage;
  const userDetail = await user.findOne({_id:_id});
  if(!userDetail){
    throw new Error("User Does not exist");
  }
  console.log(userDetail);
  res.send("Reading Cookie!!!");
  }catch(err){
    res.status(400).send("Error"+ err);
  }

});

app.post("/saveUser", async(req,res)=> {
  console.log("Saveuser !!");
   const userdata = new user(req.body);

  try{
   await userdata.save();
   res.send("User data Saved Successfully!!");
  } catch(error){
    res.status(400).send("Error occcured on SaveUser !!!" + error);
  }
  
});


//Get al users 

app.get("/feed", async(req,res)=>{
   try{
    const userDetails =  await user.find({});
     res.send(userDetails);
     console.log("Users retrived successfully");
   }catch(error) {
     res.status(404).send("Error occured on user retrival");
   }
});


// Get single user by emailid
app.get("/find", async(req,res)=>{
  try{
    const resEmailId = req.body.emailId;
    console.log("EmailID"+ resEmailId);
     const userDet = await user.findOne({emailId: resEmailId});
     console.log(userDet);
     res.send(userDet);
  }catch{
  res.status(404).send("Error occured on user retrival");
  }
});

app.delete("/user", async(req,res)=>{
 const userId = req.body.emailId;
  console.log("Deleted User UserId" + userId);
 try{
   const deletedUser = await user.deleteOne({emailId: userId});
   console.log("Deleted User" + deletedUser);
   res.send("User Deleted Successfully");
 }catch(err){
  res.status(404).send("Error occured on user deletion" + err);
 }
});


app.patch("/updateUser/:userId", async(req,res) => {
  const userDetails = req.body;
  const userId = req.params?.userId;
  try{
    const UPDATE_FIELDS= ["firstName","lastName","age","gender","skills"];
    const isUpdatevalid = Object.keys(userDetails).every((key) => UPDATE_FIELDS.includes(key));
    if(!isUpdatevalid){
      throw new Error("Invalid update fields provided test");
    }

    if(userDetails?.skills.length>5){
      throw new Error("Skills cannot be more than 5");
    }
    const updateUser = await user.findByIdAndUpdate({_id: userId}, userDetails);
    console.log("User updated Successfully !!!"+ updateUser);
    res.send("User updated Successfully");
  }catch(err){
    res.status(404).send("Error occured on user updation" + err);
  }
});

app.patch("/updateUserEmail", async(req,res) => {
  const userDetails = req.body;
  const emailId = req.body.emailId;
  try{
    const updateUser = await user.findOneAndUpdate({emailId: emailId}, userDetails);
    console.log("User EMAIL updated Successfully !!!"+ updateUser);
    res.send("User EMAIL updated Successfully");
  }catch(err){
    res.status(404).send("Error occured on user updation" + err);
  }
});
connectDB().then(() => {
   console.log("DB is Connected successfully !!");
  app.listen(3000, () => {
    console.log("Server is successfully listening in port 3000!");
  });
}).catch( err=>{
   console.log("Database cannot be connected !!" + err);
});


app.use("/admin", adminauth);

