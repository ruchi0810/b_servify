import User from "../model/userModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import Booking from "../model/bookingModel.js";
export const createbooking = async (req, res) => {
  try {
    const { userId, serviceProviderId } = req.body;
    const existingBooking = await Booking.findOne({
      userId,
      serviceProviderId,
    });

    if (existingBooking) {
      res.status(400).json({
        error: "Booking already exists for this user and service provider",
      });
      return;
    }

    const booking = await Booking.create({ userId, serviceProviderId });
    res.json({
      bookingId: booking._id,
      userstatus: booking.userstatus,
      providerstatus: booking.providerstatus,
    });
  } catch (error) {
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
