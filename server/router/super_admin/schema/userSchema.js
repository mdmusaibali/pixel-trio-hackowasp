import { checkSchema } from "express-validator";

export const addVendorSchema = checkSchema({
  name: {
    isString: {
      errorMessage: "name must be a string",
    },
  },
  location: {
    isObject: {
      errorMessage: "location must be an object",
    },
  },
  deliveryChargesPerMeter: {
    isNumeric: {
      errorMessage: "deliveryChargesPerMeter must be a number",
    },
  },
  ownerEmail: {
    isEmail: {
      errorMessage: "email must be valid",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
});
