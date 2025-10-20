const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");


app.post("/api/v0/signup", (req, res)=>{
    const user = User({
      firstName: "Kundan",
      lastName: "Dhangar",
      emailId: "KD@gmail.com",
      password: "+gar",
      age: 20,
      gender: "Male"
    })

    user.save();

    res.send("User Created!")
})




//listening...
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(2511, (req, res) => {
      console.log("listening to server");
    });
  })
  .catch((err) => {
    console.error("An Error Occured");
  });
