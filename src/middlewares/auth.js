  const jwt = require("jsonwebtoken");
  const user = require("../models/user");
 const userauth = async (req, res, next) => {
 
  try{
    const {token} = req.cookies;
    if(!token){
      return res.status(401).send("Please Login!");
    }
    const decodeobj = await jwt.verify(token, "Milan@2020");
    const {_id} = decodeobj;
    const userDetails = await user.findById(_id);
    if(!userDetails){
      throw new Error("User not found");
    }
    req.user = userDetails;
    
    next();
  }catch(error){
      throw new Error("Invalid Token");
  };

  };
  module.exports={
    userauth
  }