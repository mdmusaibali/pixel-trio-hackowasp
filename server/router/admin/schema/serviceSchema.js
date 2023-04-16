import { checkSchema } from "express-validator";

export const addServiceSchema = checkSchema({
  services: {
    isArray: {
      errorMessage: "isArray must be a string",
    },
  },
});
