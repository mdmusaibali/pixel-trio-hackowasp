import express from "express";
import auth from "../../middleware/auth.js";
import authenticateRole from "../../middleware/authenticateRole.js";
import { Booking } from "../../models/Booking.js";
import { sendMail } from "../../helpers/sendGrid.js";

const router = express();

router.get(
  "/admin/bookings",
  [auth, authenticateRole(["admin"])],
  async (req, res) => {
    try {
      const vendorOfOwner = req.vendorOfOwner;
      if (!vendorOfOwner) throw new Error("You are not a vendor");
      const bookings = await Booking.find({
        vendorId: vendorOfOwner._id,
      }).populate({ path: "owner" });
      const completedBookings = await Booking.find({
        isPending: false,
      });
      const pendingBookings = await Booking.find({
        isPending: true,
      });
      res.send({
        success: true,
        bookings,
        completedBookings: completedBookings.length,
        pendingBookings: pendingBookings.length,
      });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

router.post(
  "/admin/markCompleted",
  [auth, authenticateRole(["admin"])],
  async (req, res) => {
    try {
      const { bookingId } = req.body;
      if (!bookingId) throw new Error("Please provide bookingId");
      const booking = await Booking.findById(bookingId)
        .populate({
          path: "owner",
        })
        .populate({ path: "vendorId" });
      if (!booking) throw new Error("Booking not found");
      booking.isPending = false;
      await booking.save();
      const completedBookings = await Booking.find({
        isPending: false,
      });
      const pendingBookings = await Booking.find({
        isPending: true,
      });
      const bookingsToReturn = await Booking.find({}).populate({
        path: "owner",
      });
      sendMail({
        to: req.user.email,
        subject: "Your prints are ready",
        text: `Hello ${req?.user?.fullName}. You can now visit ${booking?.vendorId?.name} and collect your prints.`,
      });
      res.send({
        success: true,
        bookings: bookingsToReturn,
        completedBookings: completedBookings.length,
        pendingBookings: pendingBookings.length,
      });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
);

export default router;
