import express from "express";
import {
  loginSchema,
  signUpSchema,
  verifySignUpSchema,
} from "./schema/userSchema.js";
import { validateRequestBody } from "../../middleware/validateRequestBody.js";
import { User } from "../../models/User.js";
import { sendMail } from "../../helpers/sendGrid.js";
import { checkOtp } from "../../helpers/helpers.js";
import auth from "../../middleware/auth.js";
import googleAuth from "../../middleware/googleAuth.js";
const router = express.Router();

router.post(
  "/user/signUp",
  [signUpSchema, validateRequestBody],
  async (req, res) => {
    try {
      const { email, password, fullName } = req.body;

      const existingActiveUser = await User.findOne({ email, isActive: true });
      if (existingActiveUser) {
        throw new Error("Username or email already taken.");
      }

      const existingInActiveUser = await User.findOne({
        email,
        isActive: false,
      });
      if (existingInActiveUser) {
        const newUser = await User.findOne({ email });
        newUser.email = email;
        newUser.password = password;
        newUser.fullName = fullName;
        await newUser.generateOtp();
        await newUser.save();
        sendMail({
          to: email,
          subject: "Your OTP for sign up.",
          text: `Your otp is ${newUser.currentOtp}`,
        });
      } else {
        const user = new User({ email, password, fullName, isActive: false });
        await user.generateOtp();
        await user.save();
        sendMail({
          to: email,
          subject: "Your OTP for sign up.",
          text: `Your otp is ${user.currentOtp}`,
        });
      }
      res.send({
        success: true,
        message: "OTP sent to email.",
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(400).send({
          success: false,
          message: "Username or email already taken.",
        });
      }
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

router.post(
  "/user/verifySignUp",
  [verifySignUpSchema, validateRequestBody],
  async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email does not exist.");
      }
      checkOtp(user, otp);
      user.currentOtp = undefined;
      user.currentOtpExpires = undefined;
      user.isActive = true;
      const token = await user.appendNewAuthToken();
      await user.save();
      res.send({ success: true, user, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

router.post(
  "/user/login",
  [loginSchema, validateRequestBody],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      const token = await user.appendNewAuthToken();
      res.send({ success: true, user, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

// google SignIn
router.get("/user/googleSignIn", googleAuth, async (req, res) => {
  try {
    const user = req.user;
    const token = await user.appendNewAuthToken();
    res.send({ success: true, user, token });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Me
router.get("/user/me", auth, async (req, res) => {
  try {
    const user = req.user;
    const userToReturn = await User.findOne({ _id: user._id });
    res.send({ success: true, user: userToReturn });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// User Logout
router.post("/user/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((token) => token !== req.token);
    await user.save();
    res.send({ success: true, message: "Logout Successful" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Log user out from all devices
router.post("/user/logAllOut", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send({ success: true, message: "Logged out from all devices." });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export default router;
