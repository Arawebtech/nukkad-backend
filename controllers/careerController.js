// controllers/careerController.js

import Career from "../models/Career.js";
import cloudinary from "../config/cloudinary.js";

/* =================================
   CREATE
================================= */

export const createCareer = async (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        position,
        experience,
        location,
        availability,
        about,
      } = req.body;

      if (
        !fullName ||
        !email ||
        !location ||
        !about
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please fill required fields",
        });
      }

      let resumeData = {
        url: "",
        public_id: "",
      };

      if (req.file) {
        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              resource_type:
                "raw",
              folder:
                "career_resume",
            }
          );

        resumeData = {
          url: result.secure_url,
          public_id:
            result.public_id,
        };
      }

      const career =
        await Career.create({
          fullName,
          phone,
          email,
          position,
          experience,
          location,
          availability,
          about,
          resume: resumeData,
        });

      res.status(201).json({
        success: true,
        message:
          "Application submitted",
        career,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* =================================
   GET ALL
================================= */

export const getCareers = async (req, res) => {
    try {
      const careers =
        await Career.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        careers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* =================================
   GET SINGLE
================================= */

export const getCareer =async (req, res) => {
    try {
      const career =
        await Career.findById(
          req.params.id
        );

      if (!career) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      res.status(200).json({
        success: true,
        career,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* =================================
   UPDATE STATUS
================================= */

export const updateCareerStatus = async (req, res) => {
    try {
      const { status } =
        req.body;

      const career =
        await Career.findById(
          req.params.id
        );

      if (!career) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      career.status = status;

      await career.save();

      res.status(200).json({
        success: true,
        message:
          "Status updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* =================================
   DELETE
================================= */

export const deleteCareer = async (req, res) => {
    try {
      const career =
        await Career.findById(
          req.params.id
        );

      if (!career) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      if (
        career.resume &&
        career.resume.public_id
      ) {
        await cloudinary.uploader.destroy(
          career.resume.public_id,
          {
            resource_type:
              "raw",
          }
        );
      }

      await career.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };