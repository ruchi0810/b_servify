import mongoose from "mongoose";

const ProfileImgProviderScehma = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  imagePath: {
    type: String,
  },
});

export default mongoose.model("ProfileImgProvider", ProfileImgProviderScehma);
