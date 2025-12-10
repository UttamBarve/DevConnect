const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {
  editProfileSentisation,
  passwordValidation,
} = require("../utils/validation");
const profileRouter = Router();

//Profile API : Get Profile
profileRouter.get("/api/v0/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    if (req.body.email != user.email) {
      throw new Error("Can't Access Profile!");
    }
    res.json(user);
  } catch (err) {
    res.send("Profile View; ERROR: " + err.message);
  }
});

profileRouter.patch("/api/v0/profile/edit", userAuth, async (req, res) => {
  try {
    editProfileSentisation(req.body);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.send(`${loggedInUser.firstName}, your profile updated successfully`);
  } catch (err) {
    res.send("Profile Edit ERROR: " + err.message);
  }
});

profileRouter.patch(
  "/api/v0/profile/edit/password",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const password = req.body.password;
      const newPassword = req.body.newPassword;

      const isValidate = await user.validatePassword(password);
      if (!isValidate) {
        throw new Error("Please Enter Correct password");
      }

      if (!passwordValidation(newPassword)) {
        throw new Error("Please enter a Strong Password");
      }

      const newHashedPassword = await user.passwordEncryption(newPassword);
      user.password = newHashedPassword;

      user.save();

      res.send("Password Changed Successful");
    } catch (err) {
      res.send("Change Password ERROR: " + err.message);
    }
  }
);

profileRouter.post(
  "/api/v0/profile/forgotPassword/sendOTP",
  async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email: email });
      console.log(user);
      if (!user) {
        throw new Error("User Not Exists!");
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      user.otp = otp;
      user.otpExpiry = otpExpiry;

      user.save();

      res.send(
        "EMAIL: Your One Time Password is: " +
          otp +
          "\n Please DO NOT share with anyone!"
      );
    } catch (err) {
      res.send("Send OTP ERROR: " + err.message);
    }
  }
);

profileRouter.patch(
  "/api/v0/profile/forgotPassword/verifyOTP",
  async (req, res) => {
    try {
      const email = req.body.email;
      const otpInput = req.body.otp;
      const newPassword = req.body.password;
      const user = await User.findOne({ email: email });

      if (!passwordValidation(newPassword)) {
        throw new Error("Please enter a Strong Password");
      }

      const { otp, otpExpiry } = user;

      if (otp == null || otpExpiry == null) {
        throw new Error("Enter Valid Data!");
      }

      if (otpExpiry < Date.now()) {
        throw new Error("OTP has Expired");
      }

      if (otpInput != otp) {
        throw new Error("Invalid OTP");
      }

      const newHashedPassword = await user.passwordEncryption(newPassword);

      user.password = newHashedPassword;
      user.otp = null;
      user.otpExpiry = null;

      user.save();

      res.send("Password changed succefully!");
    } catch (err) {
      res.send("Verify OTP ERROR: " + err.message);
    }
  }
);

module.exports = { profileRouter };
