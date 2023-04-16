import mongoose from "mongoose";

const vendorSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      latitude: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  image: {
    type: String,
  },
  deliveryChargesPerMeter: {
    type: Number,
    required: true,
  },
  deliveryPersonals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  ratings: {
    type: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
    default: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
});

export const Vendor = mongoose.model("Vendor", vendorSchema);
