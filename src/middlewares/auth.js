const adminauth = (req, res, next) => {
    console.log("Authorization !!!");
    const token = "ABCD";
    const isAdminAuth = token == "ABC";
    if(isAdminAuth){
      res.status(402).send("is UnAuthorized !!!");
    }else{
      next();
    }
  };


  const userauth = (req, res, next) => {
    console.log("User Authorization !!!");
    const token = "XYZ";
    const isUserAuth = token == "XYZ";
    if(!isUserAuth){
      res.status(401).send("is UnAuthorized");
    }else{
      next();
    }

  };
  module.exports={
    adminauth,
    userauth
  }