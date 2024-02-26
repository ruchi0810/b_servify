import mongoose from "mongoose";

const CompletedBookingSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  userstatus: {
    type: String,
    default: "payment done", // Assuming the default value for userstatus in CompletedBooking
  },
  providerstatus: {
    type: String,
    default: "completed", // Assuming the default value for providerstatus in CompletedBooking
  },
});

export default mongoose.model("CompletedBooking", CompletedBookingSchema);
