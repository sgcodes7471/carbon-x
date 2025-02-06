import { uploadToCloudinary } from "../utils/cloudinary.js";
import Company from "../models/company.models.js";
import cloudinary from "cloudinary";
export const uploadCompanyData = async (req, res) => {
  try {
    console.log("Files received:", req.files); // Logs the uploaded files
    console.log("Request body:", req.body);
    const { name, sector, country } = req.body;
    const pdf1 = req.files.pdf1[0]; // Access uploaded file for 'pdf1'
    const pdf2 = req.files.pdf2[0]; // Access uploaded file for 'pdf2'

    // Upload files to Cloudinary
    const pdf1Upload = await uploadToCloudinary(pdf1.path, "pdfs");
    const pdf2Upload = await uploadToCloudinary(pdf2.path, "pdfs");

    // Save to the database
    const company = new Company({
      name,
      sector,
      country,
      pdf1Url: pdf1Upload.secure_url,
      pdf2Url: pdf2Upload.secure_url,
    });
    await company.save();

    res
      .status(201)
      .json({ message: "Company data uploaded successfully!", company });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to upload data", details: error.message });
  }
};
export const getCompanyData = async (req, res, next) => {
  try {
    // Fetch company data from MongoDB
    const companies = await Company.find({}); // Adjust query as per your model structure

    // Fetch PDF URLs from Cloudinary (assuming PDFs are uploaded as files in Cloudinary)
    const pdfUrls = await Promise.all(
      companies.map(async (company) => {
        const pdf1Url = await cloudinary.v2.api.resource(company.pdf1); // Assuming 'pdf1' is the field in MongoDB where the Cloudinary public_id is stored
        const pdf2Url = await cloudinary.v2.api.resource(company.pdf2); // Similarly for pdf2
        return {
          ...company.toObject(),
          pdf1Url: pdf1Url.url,
          pdf2Url: pdf2Url.url,
        };
      })
    );

    // Send response to the frontend
    res.status(200).json({
      success: true,
      data: pdfUrls,
    });
  } catch (error) {
    next(error);
  }
};
