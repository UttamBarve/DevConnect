const { verify } = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();


const userAuth = async (req,res,next) => {
    try{
        const { token } = req.cookies
    if(!token){
        throw new Error("Invalid token!!!");
    }
    const {userId} = verify(token, process.env.SECRETKEY);
    const user = await User.findById(userId);
     
    if(!user){
        throw new Error("User Not Found");
    }
    req.body.user = user; 
    next();
    } catch(err){
        res.status(400).send("Validation ERROR: " + err.message);
    }
}

module.exports = {userAuth}

