import express from "express";
import {
  createReview,
  getReviewsByServiceProvider,
  getReviewsByServiceProviderAndUser,
  getLastThreeReviewsByServiceProvider,
} from "../controller/reviewController.js";

const route = express.Router();

route.post("/create", createReview);
route.post("/last3reviews", getLastThreeReviewsByServiceProvider);
route.get("/:serviceProviderId", getReviewsByServiceProvider);
route.get(
  "/:serviceProviderId/reviews/:userId",
  getReviewsByServiceProviderAndUser
);

export default route;
