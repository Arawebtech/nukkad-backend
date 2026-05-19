import express from "express";


import authMiddleware from "../middleware/authMiddleware.js";

import {
  createService,
  deleteService,
  getActiveServices,
  getServices,
  updateService,
} from "../controllers/serviceController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  createService
);

router.get("/", getServices);
router.get("/public-service", getActiveServices);

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteService
);

router.put(
  "/update/:id",
  authMiddleware,
    upload.single("image"),
  updateService
);

export default router;