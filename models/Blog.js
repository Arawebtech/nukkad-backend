// models/Blog.js

import mongoose from "mongoose";

/* =================================
   GENERATE UNIQUE NUMBER
================================= */

const generateUniqueNumber = () => {
  return Date.now()
    .toString()
    .slice(-6);
};

/* =================================
   IMAGE SCHEMA
================================= */

const imageSchema =
  new mongoose.Schema(
    {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },

      alt: {
        type: String,
        default: "",
      },
    },
    { _id: false }
  );

/* =================================
   BLOG SCHEMA
================================= */

const blogSchema =
  new mongoose.Schema(
    {
      blogNo: {
        type: String,
        unique: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      shortDesc: {
        type: String,
        required: true,
      },

      desc: {
        type: String,
        required: true,
      },

      author: {
        type: String,
        default: "Admin",
      },

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },

    tags: [
  {
    name: {
      type: String,
      trim: true,
    },
  },
],
      coverImage: imageSchema,

      images: [imageSchema],

      seoTitle: {
        type: String,
        default: "",
      },

      seoDesc: {
        type: String,
        default: "",
      },

    seoKeywords: [
  {
    name: {
      type: String,
      trim: true,
    },
  },
],

      readTime: {
        type: String,
        default: "5 min read",
      },

      views: {
        type: Number,
        default: 0,
      },

      likes: {
        type: Number,
        default: 0,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          "draft",
          "published",
        ],
        default: "draft",
      },

      publishedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

/* =================================
   AUTO BLOG NUMBER
================================= */

blogSchema.pre(
  "save",
  async function () {
    if (!this.blogNo) {
      let isUnique = false;

      while (!isUnique) {
        const generatedNo = `BL${generateUniqueNumber()}`;

        const existing =
          await mongoose.models.Blog.findOne(
            {
              blogNo:
                generatedNo,
            }
          );

        if (!existing) {
          this.blogNo =
            generatedNo;

          isUnique = true;
        }
      }
    }

    // auto publish date
    if (
      this.status ===
        "published" &&
      !this.publishedAt
    ) {
      this.publishedAt =
        new Date();
    }
  }
);

const Blog = mongoose.model(
  "Blog",
  blogSchema
);

export default Blog;