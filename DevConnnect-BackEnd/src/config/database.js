const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(import.meta.env.MONGODB_URI);

}

module.exports = connectDB;
