import express from "express";
import { uploadCompanyData,getCompanyData } from "../controllers/dashboard.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
import Company from "../models/company.models.js";
const router = express.Router();

// Apply the Multer middleware to the /upload route
router.post(
  "/upload",
  (req, res, next) => {
    console.log("Route /api/dashboard/upload hit");
    next(); // Pass the request to the next middleware
  },
  upload.fields([
    { name: "pdf1", maxCount: 1 },
    { name: "pdf2", maxCount: 1 },
  ]),
  (req, res, next) => {
    try {
      console.log("Multer middleware executed");
      console.log("Files received by Multer:", req.files);
      console.log("Request body:", req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadCompanyData
);

router.get("/getCompanyData", async (req, res) => {
  try {
    const companies = await Company.find(); // Ensure this fetches data correctly
    console.log("Fetched companies:", companies); // Log the fetched data
    res.status(200).json({
      success: true,
      data: companies.map((company) => ({
        _id: company._id,
        name: company.name,
        sector: company.sector,
        country: company.country,
        pdf1Url: company.pdf1Url, // Ensure these fields exist in your schema
        pdf2Url: company.pdf2Url, // Ensure these fields exist in your schema
      })),
    });
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
},getCompanyData);
export default router;
