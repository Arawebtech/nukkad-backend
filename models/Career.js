// models/Career.js

import mongoose from "mongoose";

/* =================================
   GENERATE UNIQUE NUMBER
================================= */

const generateUniqueNumber = () => {
  return Date.now()
    .toString()
    .slice(-6);
};

const careerSchema =
  new mongoose.Schema(
    {
      applicationNo: {
        type: String,
        unique: true,
      },

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        required: true,
        trim: true,
      },

      position: {
        type: String,
        default: "",
      },

      experience: {
        type: String,
        default: "",
      },

      location: {
        type: String,
        required: true,
      },

      availability: {
        type: String,
        default: "",
      },

      about: {
        type: String,
        required: true,
      },

      resume: {
        url: {
          type: String,
          default: "",
        },

        public_id: {
          type: String,
          default: "",
        },
      },

      status: {
        type: String,
        enum: [
          "pending",
          "reviewed",
          "selected",
          "rejected",
        ],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

/* =================================
   AUTO NUMBER
================================= */

careerSchema.pre(
  "save",
  async function () {
    if (!this.applicationNo) {
      let isUnique = false;

      while (!isUnique) {
        const generatedNo = `CR${generateUniqueNumber()}`;

        const existing =
          await mongoose.models.Career.findOne(
            {
              applicationNo:
                generatedNo,
            }
          );

        if (!existing) {
          this.applicationNo =
            generatedNo;

          isUnique = true;
        }
      }
    }
  }
);

const Career = mongoose.model(
  "Career",
  careerSchema
);

export default Career;