import axios from "axios";
import { User } from "../models/User.js";

const googleAuth = async (req, res, next) => {
  const authorization = req.header("Authorization");
  try {
    if (!authorization) {
      throw new Error("Authorization needed");
    }
    const userToken = authorization.replace("Bearer ", "");
    if (!userToken || !(typeof userToken === "string")) {
      throw new Error("Authorization needed");
    }
    console.log(authorization);
    const response = await axios.get(
      `https://www.googleapis.com/userinfo/v2/me`,
      {
        headers: { Authorization: authorization },
      }
    );
    const userData = response.data;
    if (!userData) {
      throw new Error("User not found.");
    }
    if (!userData.verified_email) {
      throw new Error("Please verify your email.");
    }
    const user = await User.findOne({ email: userData.email, isActive: true });
    if (!user) {
      throw new Error("Please create an account.");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("ERROR ", error);
    res.status(404).send({ success: false, message: error.message });
  }
};

export default googleAuth;
