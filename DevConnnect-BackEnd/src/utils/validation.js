const validator = require("validator");

const signupValidation = (req) => {
  const { firstName, email, password } = req.body;

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
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Enter Required data!");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Enter Valid Email!");
  }
};

const editProfileSentisation = (data) => {
  // data senitization/validation at api level
  //defining valid fields
  const ValidData = [
    "firstName",
    "lastName",
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

const passwordValidation = (
  password,
  options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  }
) => {
  const {
    minLength,
    minLowercase,
    minUppercase,
    minNumbers,
    minSymbols,
    returnScore,
    pointsPerUnique,
    pointsPerRepeat,
    pointsForContainingLower,
    pointsForContainingUpper,
    pointsForContainingNumber,
    pointsForContainingSymbol,
  } = options;

  let score = 0;

  // Count characters
  const lower = (password.match(/[a-z]/g) || []).length;
  const upper = (password.match(/[A-Z]/g) || []).length;
  const numbers = (password.match(/[0-9]/g) || []).length;
  const symbols = (password.match(/[^a-zA-Z0-9]/g) || []).length;

  // Basic rules
  const meetsLength = password.length >= minLength;
  const meetsLower = lower >= minLowercase;
  const meetsUpper = upper >= minUppercase;
  const meetsNumbers = numbers >= minNumbers;
  const meetsSymbols = symbols >= minSymbols;

  // Calculate score
  const charMap = {};
  for (let char of password) {
    charMap[char] = (charMap[char] || 0) + 1;
  }

  // Unique + repeat character scoring
  Object.values(charMap).forEach((count) => {
    if (count === 1) score += pointsPerUnique;
    else score += pointsPerRepeat;
  });

  // Bonus points for character variety
  if (lower > 0) score += pointsForContainingLower;
  if (upper > 0) score += pointsForContainingUpper;
  if (numbers > 0) score += pointsForContainingNumber;
  if (symbols > 0) score += pointsForContainingSymbol;

  // Return score if requested
  if (returnScore) return score;

  // Otherwise return boolean strong/weak
  return (
    meetsLength && meetsLower && meetsUpper && meetsNumbers && meetsSymbols
  );
};

module.exports = {
  signupValidation,
  signupSentisation,
  loginSentisation,
  loginValidation,
  editProfileSentisation,
  passwordValidation
};
