const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {
  editProfileSentisation,
  passwordValidation,
} = require("../utils/validation");
const Otp = require("../models/otp");
const profileRouter = Router();
const bcrypt = require("bcrypt");

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

      if (!user) {
        throw new Error("User Not Exists!");
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      const newHashedOTP = await bcrypt.hash(otp, 10);

      await Otp.findOneAndUpdate(
        { userId: user._id },
        { otp: newHashedOTP, otpExpiry: otpExpiry },
        { upsert: true }
      );
      // TODO: email service integration is remain
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
      const otpInput = String(req.body.otp);
      const newPassword = req.body.newPassword;

      const user = await User.findOne({ email: email });
      if (!user) throw new Error("User not found");

      const otpDoc = await Otp.findOne({ userId: user._id });
      if (!otpDoc) throw new Error("OTP not found");

      if (!passwordValidation(newPassword)) {
        throw new Error("Please enter a Strong Password");
      }

      const { otpExpiry } = otpDoc;

      if (!otpInput) {
        throw new Error("OTP required");
      }

      if (otpExpiry < Date.now()) {
        throw new Error("OTP has Expired");
      }

      const isValidate = await otpDoc.validateOTP(otpInput);

      if (!isValidate) {
        throw new Error("Invalid OTP");
      }

      const newHashedPassword = await user.passwordEncryption(newPassword);

      user.password = newHashedPassword;

      await user.save();
      await Otp.deleteOne({ userId: user._id });

      res.send("Password changed succefully!");
    } catch (err) {
      res.send("Verify OTP ERROR: " + err.message);
    }
  }
);

module.exports = { profileRouter };
