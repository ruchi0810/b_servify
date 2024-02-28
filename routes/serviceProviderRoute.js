import express from "express";
import {
  createServiceProvider,
  deleteServiceProvider,
  getAllServiceProviders,
  getOneServiceProvider,
  updateServiceProvider,
  SearchServiceProvider_byservice,
  addReviewToServiceProvider,
  addRatingToServiceProvider,
  getServiceProviderByServiceName,
  getServiceProviderDetailsByEmail,
  getOneServiceProviderEmail,
  login,
  logout,
  signup,
  forgotPassword,
  updatewithlogintoken,
  getServiceProviderDetailsById,
  
} from "../controller/serviceProviderContoller.js";
import { authMiddleware_sp } from "../middleware/authMiddleware_sp.js";
const route = express.Router();

route.post("/create", createServiceProvider);
route.get("/getall", getAllServiceProviders);
route.get("/getone/:id", getOneServiceProvider);
route.post(
  "/getServiceProviderDetailsByEmail",
  getServiceProviderDetailsByEmail
);
route.post("/getServiceProviderDetailsById", getServiceProviderDetailsById);

route.get("/getonesp/:email", getOneServiceProviderEmail);

route.put("/update/:id", updateServiceProvider);
route.delete("/delete/:id", deleteServiceProvider);
route.post("/search", SearchServiceProvider_byservice);
route.get("/getallquery/:serviceName", getServiceProviderByServiceName);
route.post("/:id/reviews", addReviewToServiceProvider);
route.post("/:id/ratings", addRatingToServiceProvider);
route.get(
  "/getServiceProviderDetailsByEmail",
  getServiceProviderDetailsByEmail
);

route.post("/signup", signup);
route.get("/logout", logout);
route.get("/login", login);
route.post("/forgotpassword", forgotPassword);
route.put("/updatewithlogintoken/:id", authMiddleware_sp, updatewithlogintoken);



export default route;
