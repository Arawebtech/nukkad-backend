// routes/careerRoutes.js

import express from "express";

import {
  createCareer,
  deleteCareer,
  getCareer,
  getCareers,
  updateCareerStatus,
} from "../controllers/careerController.js";

import upload from "../middleware/multer.js";

const router =
  express.Router();

router.post(
  "/create",
  upload.single("resume"),
  createCareer
);

router.get(
  "/all",
  getCareers
);

router.get(
  "/:id",
  getCareer
);

router.put(
  "/update/:id",
  updateCareerStatus
);

router.delete(
  "/delete/:id",
  deleteCareer
);

export default router;