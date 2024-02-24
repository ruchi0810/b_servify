import express from "express";
import { uploadimg, getimg } from "../controller/imageController.js";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/src/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

const route = express.Router();

route.post("/upload-image", upload.single("image"), uploadimg);
route.get("/get-image", getimg);

export default route;
