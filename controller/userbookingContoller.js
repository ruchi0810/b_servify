import User from "../model/userModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import Booking from "../model/bookingModel.js";
import CompletedBooking from "../model/completedBookingModel.js";
import CancelBooking from "../model/cancelBookingModel.js";

export const createbooking = async (req, res) => {
  try {
    const { userId, serviceProviderId } = req.body;
    const existingBooking = await Booking.findOne({
      userId,
      serviceProviderId,
    })
      .sort({ _id: -1 })
      .limit(1);

    if (
      existingBooking &&
      !["cancel from sp", "cancel"].includes(existingBooking.userstatus)
    ) {
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
    })
      .sort({ _id: -1 })
      .limit(1);

    if (existingBooking) {
      if (
        existingBooking.userstatus === "cancel" ||
        existingBooking.userstatus === "cancel from sp"
      ) {
        res.json("notbooked");
      } else {
        res.json("booked");
      }
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
    const cancelBooking = await CancelBooking.create({
      bookingId: booking._id,
      userId: booking.userId,
      serviceProviderId: booking.serviceProviderId,
      userstatus: "cancel",
      providerstatus: "cancel from user",
    });

    res.json({
      bookingId: booking._id,
      userstatus: booking.userstatus,
      providerstatus: booking.providerstatus,
      cancelBooking,
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

export const fetchBookingUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchcanceledbookingsUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch bookings with 'cancel' status for the specified user
    const canceledBookings = await CancelBooking.find({
      userId: userId,
    });

    res.json(canceledBookings);
  } catch (error) {
    console.error("Error fetching canceled bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkcancellation = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Check if the booking exists in the cancelbooking collection
    const canceledBooking = await CancelBooking.findOne({ bookingId });

    if (canceledBooking) {
      res.json({ canceled: true });
    } else {
      res.json({ canceled: false });
    }
  } catch (error) {
    console.error("Error checking cancellation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
