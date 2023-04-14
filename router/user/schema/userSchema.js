import { checkSchema } from "express-validator";

export const signUpSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: "email is invalid",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
  fullName: {
    isString: {
      errorMessage: "fullName must be a string",
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

export const verifySignUpSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Email is invalid",
    },
  },
  otp: {
    isLength: {
      options: {
        min: 4,
        max: 4,
      },
      errorMessage: "otp must be 4 digits",
    },
    isNumeric: {
      errorMessage: "otp must be a number",
    },
  },
});

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
