import mongoose from "mongoose";

const DeclineBookingSchema = new mongoose.Schema({
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
    default: "cancel from sp", // Assuming the default value for userstatus in CompletedBooking
  },
  providerstatus: {
    type: String,
    default: "cancel booking", // Assuming the default value for providerstatus in CompletedBooking
  },
});

export default mongoose.model("DeclineBooking", DeclineBookingSchema);
