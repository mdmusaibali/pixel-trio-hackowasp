import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Vendor",
  },
  paperMaterial: {
    type: String,
    required: true,
    enum: ["Standard", "Glossy", "Bond"],
  },
  paperSize: {
    type: String,
    required: true,
    enum: ["A4", "A3", "Legal", "A1", "A2", "Letter"],
  },
  printType: {
    type: String,
    required: true,
    enum: ["Grayscale", "Color"],
  },
  perPageCost: {
    type: Number,
    required: true,
  },
});

export const Service = mongoose.model("Service", serviceSchema);
