import User from "../model/userModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import Booking from "../model/bookingModel.js";
import DeclineBooking from "../model/declineBookingModel.js";

export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        userstatus: "confirm",
        providerstatus: "accepted",
      },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({
      bookingId: booking._id,
      userstatus: booking.userstatus,
      providerstatus: booking.providerstatus,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const declineBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        userstatus: "cancel from sp",
        providerstatus: "cancel booking",
      },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({
      bookingId: booking._id,
      userstatus: booking.userstatus,
      providerstatus: booking.providerstatus,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchBooking = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    const bookings = await Booking.find({ serviceProviderId });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
