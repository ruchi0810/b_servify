import Rating from "../model/ratingModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import { io } from "../index.js";
import ProfileImgProvider from "../model/profileImgProviderModel.js";

// export const uploadimgurl = async (req, res) => {
//   try {
//     const { serviceProviderId, imagePath } = req.body;

//     // Save the image URL to MongoDB
//     const profileImgProvider = new ProfileImgProvider({
//       serviceProviderId,
//       imagePath,
//     });

//     const savedImage = await profileImgProvider.save();

//     res.status(201).json(savedImage);
//   } catch (error) {
//     console.error("Error saving image URL:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };
export const uploadimgurl = async (req, res) => {
  try {
    const { serviceProviderId, imagePath } = req.body;

    // Check if a document with the given serviceProviderId already exists
    const existingImage = await ProfileImgProvider.findOne({
      serviceProviderId,
    });

    if (existingImage) {
      // If exists, update the imagePath
      existingImage.imagePath = imagePath;
      const updatedImage = await existingImage.save();
      res.status(200).json(updatedImage);
    } else {
      // If not exists, create a new document
      const profileImgProvider = new ProfileImgProvider({
        serviceProviderId,
        imagePath,
      });

      const savedImage = await profileImgProvider.save();
      res.status(201).json(savedImage);
    }
  } catch (error) {
    console.error("Error saving image URL:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const fetchimgurl = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    // Find the corresponding image in ProfileImgProvider
    const imageEntry = await ProfileImgProvider.findOne({
      serviceProviderId,
    });

    if (imageEntry) {
      res.status(200).json({ imagePath: imageEntry.imagePath });
    } else {
      res
        .status(404)
        .json({ message: "No image uploaded for the given serviceProviderId" });
    }
  } catch (error) {
    console.error("Error fetching image URL by serviceProviderId:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    // Delete the corresponding document from ProfileImgProvider
    const deleteResult = await ProfileImgProvider.deleteOne({
      serviceProviderId,
    });

    if (deleteResult.deletedCount > 0) {
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "No image found for the given serviceProviderId" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).send("Internal Server Error");
  }
};
