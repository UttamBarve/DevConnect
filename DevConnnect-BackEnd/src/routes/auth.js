const {Router} = require("express");
const {
  signupValidation,
  signupSentisation,
  loginSentisation,
  loginValidation,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = Router();

require("dotenv").config();



// SignUp : Add user to DB
authRouter.post("/api/v0/signup", async (req, res) => {
  try {
    // Validation and Senitisation of data:
    signupSentisation(req);
    signupValidation(req);

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

    // Encrypt Password:
    const encryptedPassword = await bcrypt.hash(password, 10);;

    // Save User Data
    // creating user document
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });

    // saving the document
    await user.save();

    //sending the response
    res.send("welcome!" + " " + req.body.firstName + ",");

    // catching the error
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while creating user",
      error: err.message,
    });
  }
});


//Login API : Authentication
authRouter.post("/api/v0/login", async (req, res) => {
  try {
    // Accessing the login data
    const { email, password } = req.body;

    // applying sentisation and validation
    loginSentisation(req);
    loginValidation(req);

    // getting data from DB
    const user = await User.findOne({email:email});

    //check if user exists:
    if(!user){
      throw new Error("Email or Password is incorrect");
    }

    // comparing the password
    const isValidate = await user.validatePassword(password);

    if(isValidate){
      const token = user.getJWT();
      
      res.cookie('token', token);
      res.send("Login successful");

    }
    else{
      throw new Error("Email or Password is incorrect");
    }
  } catch (err) {
    res.send("Login ERROR: " + err);
  }
});

authRouter.get("/api/v0/logout", (req, res)=>{
  
  res.clearCookie('token');
  res.send("Logout Succeful")
})


module.exports = {authRouter}
