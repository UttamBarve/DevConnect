const { sign, verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    type: String,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("InvalidEmail")
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 100,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max:80
  },
  gender: {
    type: String,
    required: true,
    validate(value){
        if(!["male", "female", "others"].includes(value)){
            throw new Error("Gender Data is not valid");
        }
    }
  },
  photoUrl: {
    type: String,
    default: "",
    validate(value){
      if(value &&!validator.isURL(value)){
        throw new Error("InvalidUrl");
      }
    }
  },
  about: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    validate(value){
      if(value.length >= 11){
        throw new Error("only 10 skills");
      }
    }
  }
}, {
    timestamps: true
});

userSchema.methods.getJWT = function(){
  const token = sign({userId: this._id}, process.env.SECRETKEY);
  return token;
}

userSchema.methods.verifyJWT = function(token){
  const cookieData = jwt.verify(token, process.env.SECRETKEY);
  return cookieData;
  
}

userSchema.methods.validatePassword = async function (inputedPassword){
  const isValidate = await bcrypt.compare(inputedPassword, this.password);
  return isValidate
}

userSchema.methods.passwordEncryption= async function(password){
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
}



const User = mongoose.model("User", userSchema);

module.exports = User;
