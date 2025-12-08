const validator = require("validator");
const signupValidation = (req) => {
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

  if (!firstName || !email || !password) {
    throw new Error("Please Enter Required Data!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter Valid Email!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password!");
  }
};

const signupSentisation = (req) => {
  // data senitization/validation at api level
  //Accessing the request body
  data = req.body;
  //defining valid fields
  const ValidData = [
    "firstName",
    "lastName",
    "email",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  // validating fileds
  const isValidData = Object.keys(data).every((k) => ValidData.includes(k));
  if (!isValidData) {
    throw new Error("Enter Valid Data Only!");
  }
};

const loginSentisation = (req) => {
  data = req.body;
  const ValidData = ["email", "password"];
  const isValidData = Object.keys(data).every((k) => ValidData.includes(k));
  if (!isValidData) {
    throw new Error("Enter Valid Data Only!");
  }
};

const loginValidation = (req) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new Error("Enter Required data!");
    }
    if(!validator.isEmail(email)){
        throw new Error("Enter Valid Email!");
    }

};

module.exports = {
  signupValidation,
  signupSentisation,
  loginSentisation,
  loginValidation
};
