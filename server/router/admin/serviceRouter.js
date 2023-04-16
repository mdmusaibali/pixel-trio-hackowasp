import express from "express";
import { addServiceSchema } from "./schema/serviceSchema.js";
import { validateRequestBody } from "../../middleware/validateRequestBody.js";
import { Service } from "../../models/Service.js";
import auth from "../../middleware/auth.js";
import authenticateRole from "../../middleware/authenticateRole.js";
const router = express();

router.post(
  "/admin/addServices",
  [addServiceSchema, validateRequestBody, auth, authenticateRole(["admin"])],
  async (req, res) => {
    try {
      const vendorOfOwner = req.vendorOfOwner;
      if (!vendorOfOwner) {
        throw new Error("You are not a vendor");
      }
      const { services } = req.body;
      let newServices = [];
      for (let service of services) {
        const existingService = await Service.findOne({
          paperMaterial: service?.paperMaterial,
          paperSize: service?.paperSize,
          printType: service?.printType,
        });
        if (existingService)
          throw new Error("This service is already avaliable");
        newServices.push({ ...service, owner: vendorOfOwner._id });
      }
      const servicesToReturn = await Service.insertMany(newServices, {
        rawResult: false,
      });
      res.send({ success: true, services: servicesToReturn });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

router.get(
  "/admin/services",
  [auth, authenticateRole(["admin"])],
  async (req, res) => {
    try {
      const vendorOfOwner = req.vendorOfOwner;
      if (!vendorOfOwner) {
        throw new Error("You are not a vendor");
      }
      const services = await Service.find({ owner: vendorOfOwner._id });
      res.send({ success: true, services });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

router.delete(
  "/admin/service",
  [auth, authenticateRole(["admin"])],
  async (req, res) => {
    try {
      const { serviceId } = req.query;
      if (!serviceId) throw new Error("Please provide serviceId");
      await Service.deleteOne({ _id: serviceId });
      res.send({ success: true, message: "deleted the service" });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

export default router;
