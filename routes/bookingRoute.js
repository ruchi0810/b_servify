import express from "express";
import {
  createbooking,
  cancelBooking,
  paymentDone,
  checkbookingstatus,
  fetchBookingUser,
} from "../controller/userbookingContoller.js";
import {
  acceptBooking,
  declineBooking,
  fetchBooking,
} from "../controller/providerbookingContoller.js";

const route = express.Router();

route.post("/createbooking", createbooking);
route.post("/checkbookingstatus", checkbookingstatus);
route.get("/fetchbooking/:serviceProviderId", fetchBooking);
route.get("/fetchbookinguser/:userId", fetchBookingUser);
route.put("/acceptbooking/:bookingId", acceptBooking);
route.put("/declinebooking/:bookingId", declineBooking);
route.put("/cancelbooking/:bookingId", cancelBooking);
route.put("/paymentdone/:bookingId", paymentDone);

export default route;
