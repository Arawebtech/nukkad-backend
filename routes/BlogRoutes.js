// routes/blog.routes.js

import express from "express";

import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
} from "../controllers/blog.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/* =================================
   BLOG ROUTES
================================= */

router.post(
  "/create",
    upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  createBlog
);

router.get(
  "/all",
  getAllBlogs
);

router.get(
  "/:id",
  getSingleBlog
);

// routes/blog.routes.js

router.put(
  "/update/:id",

  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]),

  updateBlog
);

router.put(
  '/status/:id',
  updateBlogStatus
);

router.delete(
  "/delete/:id",
  deleteBlog
);

export default router;