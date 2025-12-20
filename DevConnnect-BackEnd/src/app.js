const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser")
require("dotenv").config();
const {authRouter} = require("./routes/auth")
const {profileRouter} = require("./routes/profile")
const {userRouter} = require("./routes/user")
const {requestsRouter} = require("./routes/requests")

// Middleware to parse Json
app.use(express.json());

// Cookie Parser
app.use(cookieParser())

// CORS POLICY FOR FRONTEND
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestsRouter)
app.use('/', userRouter)


//listening...
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(2511, (req, res) => {
      console.log("listening to server");
    });
  })
  .catch((err) => {
    console.error("An Error Occured in DB; Error: " + err.message);
  });
