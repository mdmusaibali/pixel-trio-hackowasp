import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
    currentOtp: {
      type: Number,
      required: false,
    },
    currentOtpExpires: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    expoTokens: [{ type: String }],
    roles: {
      type: [
        {
          type: String,
          enum: ["admin", "user", "super_admin"],
          required: true,
        },
      ],
      default: ["user"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await crypt.hash(user.password, 8);
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.currentOtp;
  delete userObject.currentOtpExpires;
  delete userObject.roles;
  delete userObject.__v;

  return userObject;
};

userSchema.methods.generateOtp = async function () {
  this.currentOtp = Math.floor(1000 + Math.random() * 9000);
  this.currentOtpExpires = Date.now() + 600 * 1000;
};

userSchema.methods.appendNewAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1 day",
  });
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({
    email: email,
    isActive: true,
  });
  if (!user) {
    throw new Error("Username/Email does not exist.");
  }
  const isMatch = await crypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect credentials!");
  }
  return user;
};

userSchema.statics.findAdminByCredentials = async function (email, password) {
  const user = await User.findOne({
    email: email,
    isActive: true,
    roles: {
      $in: "admin",
    },
  });
  if (!user) {
    throw new Error("Username/Email does not exist.");
  }
  const isMatch = await crypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect credentials!");
  }
  return user;
};

export const User = mongoose.model("User", userSchema);
