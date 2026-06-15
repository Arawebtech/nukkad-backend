import express from "express";

import {
  createService,
  getServices,
  getServiceById,
  getServiceBySlug,
  updateService,
  deleteService,
  getActiveServices,
} from "../controllers/services.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Accept two separate file fields: "image" (hero banner) and "thumbnail"
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

router.post("/create", uploadFields, createService);

router.get("/", getServices);
router.get("/public-services/all", getActiveServices);

router.get("/slug/:slug", getServiceBySlug);

router.get("/:id", getServiceById);

router.put("/:id", uploadFields, updateService);

router.delete("/:id", deleteService);

export default router;