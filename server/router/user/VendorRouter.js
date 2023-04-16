import express from "express";
import auth from "../../middleware/auth.js";
import { Vendor } from "../../models/Vender.js";
import { Service } from "../../models/Service.js";

const router = express.Router();

router.get("/user/vendors", auth, async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    const vendorsToReturn = [];
    for (let vendor of vendors) {
      const servicesByVendor = await Service.find({ owner: vendor._id });
      vendorsToReturn.push({ services: servicesByVendor, vendor });
    }
    res.send({ success: true, vendors: vendorsToReturn });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export default router;
