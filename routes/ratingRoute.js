import express from "express";
import {
  getRatingsByServiceProvider,
  getRatingsByServiceProvider_inorder,
  getRatingofspecificuser,
} from "../controller/ratingController.js";

const route = express.Router();

route.get("/getrating/:serviceProviderId", getRatingsByServiceProvider);
route.get(
  "/service-providers_inorder/:serviceProviderId",
  getRatingsByServiceProvider_inorder
);
route.get(
  "/getspecificrating/:userId/:serviceProviderId",
  getRatingofspecificuser
);

export default route;
