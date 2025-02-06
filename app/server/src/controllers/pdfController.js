const { uploadToCloudinary } = require("../utils/cloudinary.js");

exports.uploadPDFs = async (req, res) => {
  try {
    const files = req.files; // Assuming you're using multer for file uploads

    // Check if files are uploaded
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Validate file types (Only PDF allowed)
    const allowedMimeTypes = ["application/pdf"];
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }
    }

    const uploadResults = [];

    // Upload each file to Cloudinary
    for (const file of files) {
      const result = await uploadToCloudinary(file.path, "pdfs");
      uploadResults.push(result);
    }

    // Respond with success message and the Cloudinary results
    res
      .status(201)
      .json({ message: "PDFs uploaded successfully", data: uploadResults });
  } catch (error) {
    console.error("Error uploading PDFs:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to upload PDFs" });
  }
};

exports.getPDFs = async (req, res) => {
  // Placeholder for fetching PDF metadata from the database (if needed)
  res.status(200).json({ message: "Fetched PDFs (not implemented)" });
};
