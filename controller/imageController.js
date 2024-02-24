import Review from "../model/reviewModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import { io } from "../index.js";
import ImageDetails from "../model/imageDetails.js";
import User from "../model/userModel.js";

export const uploadimg = async (req, res) => {
  try {
    console.log(req.body);
    const imageName = req.file.filename;

    try {
      //await Images.create({ image: imageName });
      await ImageDetails.create({ image: imageName });
      res.json({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getimg = async (req, res) => {
  try {
    // Images.find({}).then((data) => {
    //   res.send({ status: "ok", data: data });
    // });
    const data = await ImageDetails.find({}); // Use ImageDetails instead of Images
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
};
