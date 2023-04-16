import { Vendor } from "../models/Vender.js";

const authenticateRole = (roleArray) => async (req, res, next) => {
  const userRoles = req.user?.roles;
  let allow = false;

  for (let role of userRoles) {
    if (roleArray.includes(role)) {
      allow = true;
    }
  }
  const vendorOfOwner = await Vendor.findOne({
    owner: req.user._id,
  });
  if (vendorOfOwner) {
    req.vendorOfOwner = vendorOfOwner;
  }
  if (allow) {
    next();
  } else {
    res.status(401).send({ success: false, message: "Unauthorized" });
  }
};

export default authenticateRole;
