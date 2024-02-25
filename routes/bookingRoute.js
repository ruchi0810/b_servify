import express from "express";
import {
  createbooking,
  cancelBooking,
} from "../controller/userbookingContoller.js";
import {
  acceptBooking,
  declineBooking,
} from "../controller/providerbookingContoller.js";

const route = express.Router();

route.post("/createbooking", createbooking);
route.put("/acceptbooking/:bookingId", acceptBooking);
route.put("/declinebooking/:bookingId", declineBooking);
route.put("/cancelbooking/:bookingId", cancelBooking);

export default route;
