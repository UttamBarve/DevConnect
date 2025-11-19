const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
const User = require("./models/user");

// Middle ware to parse Json
app.use(express.json());

// CORS POLICY FOR FRONTEND
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Add user to DB
app.post("/api/v0/signup", async (req, res) => {
  try {
    const user = User(req.body);
    await user.save();
    res.send("welcome!" + " " + req.body.firstName + ",");
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while creating user",
      error: err.message,
    }); ;
  }
});

// Get user by email
app.get("/api/v0/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.find({ email: email });
    res.json(user);
  } catch (err) {
    res.send("something went wrong in finidng user query; Error: ", err);
  }
});

// Getting all users
app.get("/api/v0/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.send("something went wrong in finding all user query; Error: ", err);
  }
});

// Delete by id:
app.delete("/api/v0/user", async (req, res) => {
  const id = req.body.id;
  try {
    await User.findByIdAndDelete(id);
    res.send("Deleted!");
  } catch (err) {
    res.send("error occured during deletion by id; Error: ", err);
  }
});

// Update User by id:
app.patch("/api/v0/user", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, req.body.data);
    res.send("User Updated!");
  } catch (err) {
    res.send("something went wrond while updating; Error: ", err);
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
