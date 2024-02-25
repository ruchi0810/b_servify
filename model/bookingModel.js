import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
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
    default: "pending",
  },
  providerstatus: {
    type: String,
    default: "pending",
  },
});

export default mongoose.model("Booking", BookingSchema);
