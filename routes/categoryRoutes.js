import express from "express";

import upload from "../middleware/multer.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} from "../controllers/categoryController.js";

const router =
  express.Router();

/* ==============================
   CREATE CATEGORY
============================== */

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  createCategory
);

/* ==============================
   UPDATE CATEGORY
============================== */

router.put(
  "/update/:id",
  authMiddleware,
  upload.single("image"),
  updateCategory
);

/* ==============================
   GET CATEGORY
============================== */

router.get(
  "/",
  getCategories
);

/* ==============================
   DELETE CATEGORY
============================== */

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteCategory
);

export default router;