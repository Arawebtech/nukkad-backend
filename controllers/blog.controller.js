// controllers/blog.controller.js

import Blog from "../models/Blog.js";

import cloudinary from "../config/cloudinary.js";
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

 const deleteFromCloudinary =
  async (
    public_id
  ) => {
    return await cloudinary.uploader.destroy(
      public_id
    );
  };


/* =========================================
   CREATE BLOG
========================================= */

export const createBlog = async (
  req,
  res
) => {
  try {
    const {
      title,
      slug,
      shortDesc,
      desc,
      author,
      category,
      tags,
      seoTitle,
      seoDesc,
      seoKeywords,
      readTime,
      featured,
      status,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !title ||
      !slug ||
      !shortDesc ||
      !desc
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, shortDesc and desc are required",
      });
    }

    /* =========================
       CHECK SLUG
    ========================= */

    const existingSlug =
      await Blog.findOne({
        slug,
      });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message:
          "Slug already exists",
      });
    }

    /* =========================
       COVER IMAGE
    ========================= */

    let coverImage = {
      url: "",
      public_id: "",
    };

    if (
      req.files?.coverImage?.[0]
    ) {
      const file =
        req.files.coverImage[0];

      const result =
        await uploadFromBuffer(
          file.buffer
        );

      coverImage = {
        url:
          result.secure_url,
        public_id:
          result.public_id,
        alt: title,
      };
    }

    /* =========================
       MULTIPLE IMAGES
    ========================= */

    let images = [];

    if (req.files?.images) {
      for (const file of req
        .files.images) {
        const result =
          await uploadFromBuffer(
            file.buffer
          );

        images.push({
          url:
            result.secure_url,
          public_id:
            result.public_id,
          alt: title,
        });
      }
    }

    /* =========================
       CREATE BLOG
    ========================= */

    const blog =
      await Blog.create({
        title,
        slug,
        shortDesc,
        desc,
        author,
        category,

        tags: tags
          ? JSON.parse(tags)
          : [],

        seoTitle,

        seoDesc,

        seoKeywords:
          seoKeywords
            ? JSON.parse(
                seoKeywords
              )
            : [],

        readTime,

        featured:
          featured ===
          "true",

        status,

        coverImage,

        images,
      });

    res.status(201).json({
      success: true,
      message:
        "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
/* =================================
   GET ALL BLOGS
================================= */

export const getAllBlogs = async (req, res) => {
    try {
      let {
        page = 1,
        limit = 10,
        search = "",
        status,
      } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      const query = {};

      // search
      if (search) {
        query.title = {
          $regex: search,
          $options: "i",
        };
      }

      // status filter
      if (status) {
        query.status = status;
      }

      const total =
        await Blog.countDocuments(
          query
        );

      const blogs =
        await Blog.find(query)
          .populate("category")
          .sort({
            createdAt: -1,
          })
          .skip(
            (page - 1) * limit
          )
          .limit(limit);

      res.status(200).json({
        success: true,

        total,

        currentPage: page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        data: blogs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* =================================
   GET SINGLE BLOG
================================= */

export const getSingleBlog = async (req, res) => {
    try {
      const blog = await Blog.findById(
          req.params.id
        ).populate("category");

      if (!blog) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Blog not found",
          });
      }

      // auto views increase
      blog.views += 1;

      await blog.save();

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  // controller

export const updateBlogStatus =async (req, res) => {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      if (
        ![
          'draft',
          'published',
        ].includes(status)
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid status',
          });
      }

      const blog =
        await Blog.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

      if (!blog) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Blog not found',
          });
      }

      res.status(200).json({
        success: true,
        message:
          'Status updated successfully',
        data: blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
/* =================================
   UPDATE BLOG
================================= */

// controllers/blog.controller.js




/* =========================================
   UPDATE BLOG
========================================= */

export const updateBlog = async (
  req,
  res
) => {
  try {
    const blog =
      await Blog.findById(
        req.params.id
      );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message:
          "Blog not found",
      });
    }

    const {
      title,
      slug,
      shortDesc,
      desc,
      author,
      category,
      tags,
      seoTitle,
      seoDesc,
      seoKeywords,
      readTime,
      featured,
      status,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !title ||
      !slug ||
      !shortDesc ||
      !desc
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, shortDesc and desc are required",
      });
    }

    /* =========================
       CHECK SLUG
    ========================= */

    const existingSlug =
      await Blog.findOne({
        slug,
        _id: {
          $ne: req.params.id,
        },
      });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message:
          "Slug already exists",
      });
    }

    /* =========================
       UPDATE COVER IMAGE
    ========================= */

    let coverImage =
      blog.coverImage;

    if (
      req.files?.coverImage?.[0]
    ) {
      /* DELETE OLD IMAGE */

      if (
        blog.coverImage
          ?.public_id
      ) {
        await deleteFromCloudinary(
          blog.coverImage
            .public_id
        );
      }

      /* UPLOAD NEW IMAGE */

      const file =
        req.files.coverImage[0];

      const result =
        await uploadFromBuffer(
          file.buffer
        );

      coverImage = {
        url:
          result.secure_url,

        public_id:
          result.public_id,

        alt: title,
      };
    }

    /* =========================
       ADD NEW MULTIPLE IMAGES
    ========================= */

    let images =
      blog.images || [];

    if (req.files?.images) {
      for (const file of req
        .files.images) {
        const result =
          await uploadFromBuffer(
            file.buffer
          );

        images.push({
          url:
            result.secure_url,

          public_id:
            result.public_id,

          alt: title,
        });
      }
    }

    /* =========================
       UPDATE BLOG
    ========================= */

    blog.title = title;

    blog.slug = slug;

    blog.shortDesc =
      shortDesc;

    blog.desc = desc;

    blog.author = author;

    blog.category =
      category;

    blog.tags = tags
      ? JSON.parse(tags)
      : [];

    blog.seoTitle =
      seoTitle;

    blog.seoDesc =
      seoDesc;

    blog.seoKeywords =
      seoKeywords
        ? JSON.parse(
            seoKeywords
          )
        : [];

    blog.readTime =
      readTime;

    blog.featured =
      featured === "true";

    blog.status = status;

    blog.coverImage =
      coverImage;

    blog.images = images;

    /* AUTO PUBLISH DATE */

    if (
      status ===
        "published" &&
      !blog.publishedAt
    ) {
      blog.publishedAt =
        new Date();
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message:
        "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

/* =================================
   DELETE BLOG
================================= */

export const deleteBlog =
  async (req, res) => {
    try {
      const blog =
        await Blog.findByIdAndDelete(
          req.params.id
        );

      if (!blog) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Blog not found",
          });
      }

      res.status(200).json({
        success: true,
        message:
          "Blog deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };