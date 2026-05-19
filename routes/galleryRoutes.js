import express from "express";
import {
  createGallery,
  getAllGallery,
  getSingleGallery,
  updateGallery,
  deleteGallery,
  toggleStatus,
  getActiveAllGallery,
} from "../controllers/galleryController.js";

import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  createGallery
);

router.get("/", getAllGallery);
router.get("/public-gallery", getActiveAllGallery);
router.get("/:id", getSingleGallery);

router.put(
  "/update/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  updateGallery
);

router.delete("/delete/:id", deleteGallery);

router.patch("/toggle/:id", toggleStatus);

export default router;