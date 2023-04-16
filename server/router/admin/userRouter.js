import express from "express";
import { User } from "../../models/User.js";
import { validateRequestBody } from "../../middleware/validateRequestBody.js";
import { loginSchema } from "./schema/userSchema.js";

const router = express();

router.post(
  "/admin/login",
  [loginSchema, validateRequestBody],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findAdminByCredentials(email, password);
      const token = await user.appendNewAuthToken();
      res.send({ success: true, user, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

export default router;
