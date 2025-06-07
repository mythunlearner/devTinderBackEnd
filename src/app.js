const {adminauth, userauth} = require("./middlewares/auth");
const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");
const app = express();

app.use(express.json());

app.post("/saveUser", async(req,res)=> {
  console.log("Saveuser !!");
   const userdata = new user(req.body);

  try{
   await userdata.save();
   res.send("User data Saved Successfully!!");
  } catch(error){
    res.status(400).send("Error occcured on SaveUser !!!");
  }
  
});

connectDB().then(() => {
   console.log("DB is Connected successfully !!");
  app.listen(3000, () => {
    console.log("Server is successfully listening in port 3000!");
  });
}).catch( err=>{
   console.log("Database cannot be connected !!");
});




app.use("/admin", adminauth);

