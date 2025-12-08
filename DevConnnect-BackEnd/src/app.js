const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
const User = require("./models/user");
const {
  signupValidation,
  signupSentisation,
  loginSentisation,
  loginValidation,
} = require("./utils/validation");
const cookieParser = require("cookie-parser")
const { userAuth } = require("./middlewares/auth");
require("dotenv").config();


// Middle ware to parse Json
app.use(express.json());

// Cookie Parser
app.use(cookieParser())

// CORS POLICY FOR FRONTEND
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);





// SignUp : Add user to DB
app.post("/api/v0/signup", async (req, res) => {
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
    const encryptedPassword = await user.passwordEncryption(password);

    // Save User Data
    // creating user document
    const user = User({
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
app.post("/api/v0/login", async (req, res) => {
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



//Profile API : Get Profile
app.get("/api/v0/profile", userAuth, async (req,res) => {
  try{

    const user = req.body.user;
    console.log(req.body.email + "\n" + user.email)
    if(req.body.email != user.email){
      throw new Error("Can't Access Profile!")
    }
    res.json(user);


    
  } catch(err){
    res.send("Profile Error " + err );
  }


})



//User API : Get user by email
app.get("/api/v0/user", async (req, res) => {
  const email = req.body.email;
  const cookies = req.cookies
  const cookieData = user.verifyJWT(cookies.token);
  try {
    const {firstName, lastName}  = await User.findById(cookieData.userId);
    const user = await User.findOne({ email: email });
    if(!user){
      throw new Error("User Not Exists")
    }
    res.json(user);
  } catch (err) {
    res.send("ERROR: " + err);
  }
});



//Feed API : Get all users
app.get("/api/v0/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.send("something went wrong in finding all user query; Error: ", err);
  }
});



//Delete API : Delete by id:
app.delete("/api/v0/user", async (req, res) => {
  const id = req.body.id;
  try {
    await User.findByIdAndDelete(id);
    res.send("Deleted!");
  } catch (err) {
    res.send("error occured during deletion by id; Error: ", err);
  }
});



//Patch API : Update User by id:
app.patch("/api/v0/user", async (req, res) => {
  try {
    //accessing the data from the request
    const data = req.body.data;
    // applying the api level senitization
    const ValidData = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const isValidData = Object.keys(data).every((field) =>
      ValidData.includes(field)
    );
    if (!isValidData) {
      throw new Error("Enter Valid data");
    }

    // finding and updating the user
    await User.findByIdAndUpdate(req.body.id, data, { runValidators: true });

    //responding
    res.send("User Updated!");

    //catching the error
  } catch (err) {
    res.send("something went wrong while updating; " + err);
  }
});





//listening...
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(2511, (req, res) => {
      console.log("listening to server");
    });
  })
  .catch((err) => {
    console.error("An Error Occured in DB; Error: ", err);
  });
