import express from "express";
import {
  uploadimgurl,
  fetchimgurl,
  deleteImage,
} from "../controller/profileImgProviderController.js";

const route = express.Router();

route.post("/uploadimgurl", uploadimgurl);
route.get("/fetchimgurl/:serviceProviderId", fetchimgurl);
route.delete("/deleteimg/:serviceProviderId", deleteImage);

export default route;
