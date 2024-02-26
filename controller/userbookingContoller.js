import User from "../model/userModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import Booking from "../model/bookingModel.js";
import CompletedBooking from "../model/completedBookingModel.js";
export const createbooking = async (req, res) => {
  try {
    const { userId, serviceProviderId } = req.body;
    const existingBooking = await Booking.findOne({
      userId,
      serviceProviderId,
    });

    if (existingBooking) {
      res.json("booked");
      return;
    }

    const booking = await Booking.create({ userId, serviceProviderId });
    res.json({
      bookingId: booking._id,
      userstatus: booking.userstatus,
      providerstatus: booking.providerstatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const checkbookingstatus = async (req, res) => {
  try {
    const { userId, serviceProviderId } = req.body;
    const existingBooking = await Booking.findOne({
      userId,
      serviceProviderId,
    });

    if (existingBooking) {
      res.json("booked");
    } else {
      // If no booking exists, return null or any other indicator
      res.json("notbooked");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        userstatus: "cancel",
        providerstatus: "cancel from user",
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

export const paymentDone = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking entry to be moved to CompletedBooking collection
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    // Create a new CompletedBooking entry
    const completedBooking = await CompletedBooking.create({
      bookingId: booking._id,
      userId: booking.userId,
      serviceProviderId: booking.serviceProviderId,
      userstatus: "payment done",
      providerstatus: "completed",
    });

    // Delete the corresponding entry from the Booking collection
    await Booking.findByIdAndDelete(bookingId);

    res.json({
      completedBookingId: completedBooking._id,
      userstatus: completedBooking.userstatus,
      providerstatus: completedBooking.providerstatus,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
