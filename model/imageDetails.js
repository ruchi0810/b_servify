import mongoose from "mongoose";

const ImageDetailsScehma = new mongoose.Schema(
  {
    image: String,
  },
  {
    collection: "ImageDetails",
  }
);

export default mongoose.model("ImageDetails", ImageDetailsScehma);

// import mongoose from "mongoose";

// const ImageDetailsScehma = new mongoose.Schema({
//   serviceProviderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ServiceProvider",
//     required: true,
//   },
//   image: {
//     type: String,
//   },
// });

// export default mongoose.model("ImageDetails", ImageDetailsScehma);
