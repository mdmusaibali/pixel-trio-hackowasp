import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const auth = async (req, res, next) => {
  const authorization = req.header("Authorization");
  try {
    if (!authorization) {
      throw new Error("Authorization needed");
    }
    const userToken = authorization.replace("Bearer ", "");
    if (!userToken || !(typeof userToken === "string")) {
      throw new Error("Authorization needed");
    }
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      tokens: userToken,
      isActive: true,
    });
    if (!user) {
      throw new Error("Please authenticate");
    }
    req.user = user;
    req.token = userToken;
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      const userToken = authorization.replace("Bearer ", "");
      const user = await User.findOne({
        tokens: userToken,
        isActive: true,
      });
      if (!user) {
        return res
          .status(401)
          .send({ success: false, message: "Token expired" });
      }
      const newTokensArr = user.tokens.filter((token) => token !== userToken);
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          tokens: newTokensArr,
        }
      );
      return res.status(401).send({ success: false, message: "Token expired" });
    }
    return res.status(401).send({ success: false, message: error.message });
  }
};

export default auth;
