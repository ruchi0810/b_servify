import ServiceProvider from "../model/serviceProviderModel.js";
import Review from "../model/reviewModel.js";
import Rating from "../model/ratingModel.js";
import User from "../model/userModel.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose"; // Import mongoose
import AllDeletedServiceProvider from "../model/allDeletedServiceProviderModel.js";

export const createServiceProvider = async (req, res) => {
  try {
    const { password, ...serviceProviderDataWithoutPassword } = req.body;

    // Manually hash the password before creating the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const serviceProviderData = new ServiceProvider({
      ...serviceProviderDataWithoutPassword,
      password: hashedPassword,
    });

    if (!serviceProviderData) {
      return res.status(404).json({ msg: "user data not found" });
    }

    const savedData = await serviceProviderData.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviderData = await ServiceProvider.find();
    if (!serviceProviderData) {
      return res.status(404).json({ msg: "Service provider data not found" });
    }
    res.status(200).json(serviceProviderData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for fetching one perticular record
export const getOneServiceProvider = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await ServiceProvider.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "service provider data not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for updating data
export const updateServiceProvider = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await ServiceProvider.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "serviceprovider data not found" });
    }
    const updatedData = await ServiceProvider.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for deleting record
// export const deleteServiceProvider = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const serviceProviderExist = await ServiceProvider.findById(id);

//     if (!serviceProviderExist) {
//       return res.status(404).json({ msg: "Service provider not found" });
//     }

//     const reviews = await Review.find({ serviceProviderId: id }).populate(
//       "userId",
//       "name mobile"
//     );
//     const formattedReviews = reviews.map((review) => ({
//       userId: {
//         _id: review.userId._id,
//         name: review.userId.name,
//         mobile: review.userId.mobile,
//       },
//       rating: review.rating,
//       review: review.reviews,
//     }));

//     // Create an entry in the AllDeletedServiceProvider collection
//     const deletedServiceProvider = new AllDeletedServiceProvider({
//       serviceProviderId: serviceProviderExist._id,
//       serviceProviderInfo: {
//         spname: serviceProviderExist.spname,
//         spmobile: serviceProviderExist.spmobile,
//         spaddress: serviceProviderExist.spaddress,
//         spcity: serviceProviderExist.spcity,
//         spservicename: serviceProviderExist.spservicename,
//         spemail: serviceProviderExist.spemail,
//         sppassword: serviceProviderExist.sppassword,
//       },
//       reviews: formattedReviews,
//     });

//     // Save the entry to the AllDeletedServiceProvider collection
//     await deletedServiceProvider.save();

//     // Delete the service provider and associated reviews
//     await ServiceProvider.findByIdAndDelete(id);
//     await Review.deleteMany({ serviceProviderId: id });

//     res.status(200).json({ msg: "Service provider deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const deleteServiceProvider = async (req, res) => {
  try {
    const id = req.params.id;
    const serviceProviderExist = await ServiceProvider.findById(id);

    if (!serviceProviderExist) {
      return res.status(404).json({ msg: "Service provider not found" });
    }

    const reviews = await Review.find({ serviceProviderId: id }).populate(
      "userId",
      "name mobile"
    );
    const ratings = await Rating.find({ serviceProviderId: id }).populate(
      "userId",
      "name mobile"
    );
    const formattedReviews = reviews.map((review) => ({
      review_id: review._id,
      userId: {
        _id: review.userId._id,
        name: review.userId.name,
        mobile: review.userId.mobile,
      },
      review: review.reviews,
    }));
    const formattedRatings = ratings.map((rating) => ({
      rating_id: rating._id,
      userId: {
        _id: rating.userId._id,
        name: rating.userId.name,
        mobile: rating.userId.mobile,
      },
      ratings: rating.rating,
    }));

    // Create an entry in the AllDeletedServiceProvider collection
    const deletedServiceProvider = new AllDeletedServiceProvider({
      serviceProviderId: serviceProviderExist._id,
      serviceProviderInfo: {
        lname: serviceProviderExist.lname,
        fname: serviceProviderExist.fnamename,
        mobile: serviceProviderExist.mobile,
        location: serviceProviderExist.location,
        city: serviceProviderExist.city,
        domain: serviceProviderExist.domain,
        email: serviceProviderExist.email,
        password: serviceProviderExist.password,
        overallRating: serviceProviderExist.overallRating,
      },
      reviews: formattedReviews,
      ratings: formattedRatings,
    });

    // Save the entry to the AllDeletedServiceProvider collection
    await deletedServiceProvider.save();

    // Delete the service provider and associated reviews
    await ServiceProvider.findByIdAndDelete(id);
    await Review.deleteMany({ serviceProviderId: id });
    await Rating.deleteMany({ serviceProviderId: id });

    res.status(200).json({ msg: "Service provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//search by service
export const SearchServiceProvider_byservice = async (req, res) => {
  try {
    const { query1, query2 } = req.body;
    const filter = {
      $and: [
        {
          domain: { $regex: `\\b${query1}\\b`, $options: "i" },
          city: { $regex: `\\b${query2}\\b`, $options: "i" },
        },
      ],
    };
    const filterData = await ServiceProvider.find(filter);
    if (filterData.length === 0) {
      res.status(404).json({ msg: "Data not found" });
    }
    res.status(200).json(filterData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//query in api url
export const getServiceProviderByServiceName = async (req, res) => {
  try {
    const { serviceName } = req.params;
    const serviceProvider = await ServiceProvider.find({
      domain: serviceName,
    });

    if (!serviceProvider) {
      return res
        .status(404)
        .json({ msg: `Service provider for service ${serviceName} not found` });
    }

    res.status(200).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// localhost:8000/api/service-providers/getallquery/carpenter

// export const addReviewToServiceProvider = async (req, res) => {
//   try {
//     const serviceProviderId = req.params.id;

//     const serviceProvider = await ServiceProvider.findById(serviceProviderId);
//     if (!serviceProvider) {
//       return res.status(404).json({ msg: "Service provider not found" });
//     }
//     const reviewData = req.body;
//     const userId = new mongoose.Types.ObjectId(reviewData.userId); // Convert userId to ObjectId
//     // console.log("Received review data:", reviewData); // Add this line

//     const review = new Review({ ...reviewData, serviceProviderId });
//     const savedReview = await review.save();

//     const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
//       serviceProviderId,
//       { $push: { reviews: savedReview._id } },
//       { new: true }
//     );

//     // console.log("Updated serviceProvider data:", serviceProvider); // Add this line

//     res.status(200).json(savedReview);
//   } catch (error) {
//     // console.error("Error in addReviewToServiceProvider:", error); // Add this line
//     res.status(500).json({ error: error.message });
//   }
// };

export const addReviewToServiceProvider = async (req, res) => {
  try {
    const serviceProviderId = req.params.id;
    const userId = req.body.userId;

    // Check if the user has already given a review to this service provider
    const existingReview = await Review.findOne({
      serviceProviderId,
      userId,
    });

    if (existingReview) {
      return res.status(400).json({
        msg: "User has already given a review to this service provider",
      });
    }

    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ msg: "Service provider not found" });
    }

    const reviewData = req.body;

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const review = new Review({
      ...reviewData,
      serviceProviderId,
      userId: userObjectId,
    });
    const savedReview = await review.save();

    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      serviceProviderId,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    res.status(200).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// POST localhost:8000/api/service-providers/SP_ID/reviews

// {
//   "userId": "USER_ID",
//   "rating": 5,
//   "comment": "Great service!"
// }

export const addRatingToServiceProvider = async (req, res) => {
  try {
    const serviceProviderId = req.params.id;
    const userId = req.body.userId;
    const ratingValue = req.body.rating;

    // Check if the user has already given a rating to this service provider
    const existingRating = await Rating.findOne({
      serviceProviderId,
      userId,
    });

    if (existingRating) {
      return res.status(400).json({
        msg: "User has already given a rating to this service provider",
      });
    }

    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ msg: "Service provider not found" });
    }

    const rating = new Rating({
      serviceProviderId,
      userId,
      rating: ratingValue,
    });

    const savedRating = await rating.save();

    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      serviceProviderId,
      { $push: { ratings: savedRating._id } },
      { new: true }
    );

    // Calculate the new overall rating
    const existingRatings = await Rating.find({ serviceProviderId });

    // Sum up all ratings, including the new one, with half-star increments
    const totalRating = existingRatings.reduce(
      (sum, rating) => sum + rating.rating,
      savedRating.rating
    );

    // Update the overall rating in the service provider model
    const newOverallRating =
      Math.round((totalRating / (existingRatings.length + 1)) * 2) / 2;

    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      overallRating: newOverallRating,
    });

    res.status(200).json(savedRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;

    // Check if the user already exists
    const existingUser = await ServiceProvider.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Sp already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with hashed password
    const newUser = new ServiceProvider({
      email,
      password: hashedPassword,
      ...otherData,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await ServiceProvider.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "serviceprovider not exist" });
    }

    // compare password with database password
    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "email or password invalid" });
    }
    const cookies = req.cookies;

    const tokenExist = cookies.token;

    if (tokenExist) {
      return res.status(400).json({ message: "Alreay logged in" });
    }

    const token = Jwt.sign(
      { serviceProviderId: userExist._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export const logout = async (req, res) => {
  try {
    const tokenExist = req.cookies.token;

    if (!tokenExist) {
      return res.status(400).json({ message: "login required" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updatewithlogintoken = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await ServiceProvider.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "serviceProvider data not found" });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    const updatedData = await ServiceProvider.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the email exists in the user collection
    const existingUser = await ServiceProvider.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ msg: "SP not found" });
    }

    // Generate a new hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password in the database
    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServiceProviderDetailsByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await ServiceProvider.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ msg: "service provider data not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export const getServiceProviderDetailsById = async (req, res) => {
  try {
    const id = req.body;
    const userExist = await ServiceProvider.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "service provider data not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getOneServiceProviderEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const userExist = await ServiceProvider.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ msg: "service provider data not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//search by service
export const citydomain = async (req, res) => {
  try {
    const city = req.params.city;
    const domain = req.params.domain;

    const filter = {
      $and: [
        { domain: { $regex: new RegExp("^" + domain + "$", "i") } },
        { city: { $regex: new RegExp("^" + city + "$", "i") } },
      ],
    };
    const filterData = await ServiceProvider.find(filter);

    if (filterData.length === 0) {
      return res.status(404).json({ msg: "Data not found" }); // Add return here
    }
    return res.status(200).json(filterData); // Add return here
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" }); // Add return here
  }
};
