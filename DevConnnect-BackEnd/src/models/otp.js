const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpiry:{
        type: Date,
        required: true,
    },
},
    {timestamps: true}
)


otpSchema.methods.validateOTP = async function (inputedOTP){
  const isValidate = await bcrypt.compare(inputedOTP, this.otp);
  return isValidate
}


const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;