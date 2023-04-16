import { checkSchema } from "express-validator";

export const loginSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: "email is invalid",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
  password: {
    isStrongPassword: {
      errorMessage: "password must be strong",
    },
    isString: {
      errorMessage: "password must be a string",
    },
  },
});
