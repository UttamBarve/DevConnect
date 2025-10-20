const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://uttambarve:pass123@devconnect.t1tkocb.mongodb.net/DevConnect");

}

module.exports = connectDB;
