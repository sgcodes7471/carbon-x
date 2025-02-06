import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pdf1Url: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^(https?:\/\/)/.test(value),
        message: "Invalid URL format for pdf1Url",
      },
    },
    pdf2Url: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^(https?:\/\/)/.test(value),
        message: "Invalid URL format for pdf2Url",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// This will automatically use the "companies" collection in the database
const Company = mongoose.model("Company", companySchema);

export default Company;
