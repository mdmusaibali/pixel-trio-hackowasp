import express from "express";
import auth from "../../middleware/auth.js";
import { Service } from "../../models/Service.js";
import { Booking } from "../../models/Booking.js";
import { uploadToS3Bucket } from "../../helpers/S3.js";

const router = express.Router();

router.post("/user/bookService", auth, async (req, res) => {
  try {
    //////////////////////////////////////////////////////////
    let booking = undefined;
    // TODO: callback not throwing error.
    const cbToCallInKeyFnOfMulterS3 = async (req, file, cb) => {
      try {
        const { paperMaterial, paperSize, printType, from, to, vendorId } =
          req.body;
        if (!vendorId) throw new Error("please provide vendorId");
        const service = await Service.findOne({
          owner: vendorId,
          paperSize,
          printType,
          paperMaterial,
        });
        if (!service) throw new Error("This combination is not available");
        const totalAmount = service.perPageCost * (+to - +from);
        booking = new Booking({
          owner: req.user._id,
          vendorId: vendorId,
          paperSize,
          printType,
          paperMaterial,
          from,
          to,
          fileName: file.originalname,
          totalAmount,
        });
      } catch (error) {
        throw new Error(error?.message);
      }
    };

    const s3upload = uploadToS3Bucket({
      bucketName: "hackowasp",
      folderPath: "documents",
      mimeTypes: ["application/pdf"],
      maxFileSizeInBytes: 5000000,
      requiredFieldInReqBody: "vendorId",
      cbToCallInKeyFnOfMulterS3,
    }).single("file");
    s3upload(req, res, async (error) => {
      if (error)
        return res.status(500).send({ success: false, message: error.message });
      if (req.file && req.file.location) {
        booking.fileUrl = req.file.location;
        await booking.save();
        res.send({
          success: true,
          booking,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Please provide a file",
        });
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.get("/user/bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id });
    res.send({ success: true, bookings });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

export default router;
