import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vendor",
    },
    fileName: {
      type: String,
    },
    paperMaterial: {
      type: String,
      required: true,
    },
    paperSize: {
      type: String,
      required: true,
    },
    printType: {
      type: String,
      required: true,
    },
    from: {
      type: Number,
      required: true,
    },
    to: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    isPending: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);
