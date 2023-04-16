import express from "express";
import "./db/mongoose.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ success: true, message: "API working" });
});

/////////////USER ROUTER///////////////////
import userRouter from "./router/user/userRouter.js";
app.use(userRouter);
import vendorRouter from "./router/user/VendorRouter.js";
app.use(vendorRouter);
import bookingsRouter from "./router/user/bookingRouter.js";
app.use(bookingsRouter);

/////////////ADMIN ROUTER///////////////////
import adminUserRouter from "./router/admin/userRouter.js";
app.use(adminUserRouter);

import adminServiceRouter from "./router/admin/serviceRouter.js";
app.use(adminServiceRouter);

import adminBookingRouter from "./router/admin/bookingsRouter.js";
app.use(adminBookingRouter);

/////////////ADMIN ROUTER///////////////////
import superAdminVendorRouter from "./router/super_admin/vendorRouter.js";
app.use(superAdminVendorRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening at ", process.env.PORT);
});
