import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    designation: { type: String },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String },

    inquiryType: { type: String },
    objective: { type: String },

    locations: { type: String },
    duration: { type: String },
    audience: { type: String },
    budget: { type: String },

    requirements: { type: String },

    terms: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "contacted", "approved", "rejected"],
      default: "pending",
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);