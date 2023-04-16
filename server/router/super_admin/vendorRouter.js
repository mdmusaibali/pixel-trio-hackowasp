import express from "express";
import { User } from "../../models/User.js";
import { Vendor } from "../../models/Vender.js";
import auth from "../../middleware/auth.js";
import authenticateRole from "../../middleware/authenticateRole.js";
import { uploadToS3Bucket } from "../../helpers/S3.js";

const router = express.Router();

router.post(
  "/super_admin/addVendor",
  [auth, authenticateRole(["super_admin"])],
  async (req, res) => {
    try {
      //////////////////////////////////////////////////////////
      let vendorShop = undefined;
      // TODO: callback not throwing error.
      const cbToCallInKeyFnOfMulterS3 = async (req, file, cb) => {
        try {
          const {
            name,
            latitude,
            longitude,
            deliveryChargesPerMeter,
            ownerEmail,
          } = req.body;
          const vendor = await User.findOne({
            email: ownerEmail,
            isActive: true,
          });
          if (!vendor) throw new Error("Please create xeroGo account first");

          const existingVendor = await Vendor.findOne({ owner: vendor._id });
          if (existingVendor) {
            throw new Error("Already a vendor");
          }

          const vendorRoles = vendor.roles;
          if (!vendorRoles.includes("admin")) {
            vendorRoles.push("admin");
          }
          vendorShop = new Vendor({
            name,
            location: { latitude, longitude },
            deliveryChargesPerMeter,
            owner: vendor._id,
          });
          await vendor.save();
          // await vendorShop.save();
          req.body.vendorId = vendorShop._id;
        } catch (error) {
          throw new Error(error?.message);
        }
      };

      const s3upload = uploadToS3Bucket({
        bucketName: "hackowasp",
        folderPath: "vendor_images",
        mimeTypes: ["image/jpg", "image/jpeg", "image/png"],
        maxFileSizeInBytes: 5000000,
        fileTypeToStoreAs: ".jpg",
        requiredFieldInReqBody: "vendorId",
        cbToCallInKeyFnOfMulterS3,
      }).single("image");
      s3upload(req, res, async (error) => {
        if (error)
          return res
            .status(500)
            .send({ success: false, message: error.message });
        if (req.file && req.file.location) {
          vendorShop.image = req.file.location;
          await vendorShop.save();
          res.send({
            success: true,
            message: "Added vendor",
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
  }
);

export default router;
