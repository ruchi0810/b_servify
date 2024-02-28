import mongoose from "mongoose";
import Review from "../model/reviewModel.js"; // Import the Review model
import Rating from "../model/ratingModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";

const serviceProviderSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  jobs: {
    type: Number,
    required: true,
  },
  experties: [
    {
      type: String,
    },
  ],

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        const emailRegx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegx.test(email);
      },
      message: "Email format is invalid",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        return password.length >= 6;
      },
      message: "password must be greter than 6 character",
    },
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  overallRating: {
    type: Number,
    default: 0,
  },
  emailvarified: {
    type: String,
    default: false,
  },
  mobilevarified: {
    type: String,
    default: false,
  },
  profileimg: {
    type: String,
  },
});
serviceProviderSchema.pre("findOneAndDelete", async function (next) {
  const serviceProviderId = this._conditions._id;

  // Delete associated reviews and ratings
  await Review.deleteMany({ serviceProviderId });
  await Rating.deleteMany({ serviceProviderId });

  next();
});
serviceProviderSchema.pre("save", async function (next) {
  const serviceprovider = this;
  if (!serviceprovider.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(serviceprovider.password, salt);
    //serviceprovider.sppassword = hashedPassword;
    next();
  } catch (error) {
    console.log(error);
  }
});
export default mongoose.model("ServiceProvider", serviceProviderSchema);
//table nu naam aekvachan ma
