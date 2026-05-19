import Category from "../models/Category.js";

import cloudinary from "../config/cloudinary.js";



/* ==============================
   CREATE CATEGORY
============================== */

export const createCategory = async (
  req,
  res
) => {
  try {
    const { title, icon,status } =
      req.body;

      console.log("get the data",title)

    // title check
    const alreadyExist =
      await Category.findOne({
        title,
      });

    if (alreadyExist) {
      return res.status(400).json({
        success: false,
        message:
          "Category already exists",
      });
    }

    let image = {
      url: "",
      public_id: "",
    };

    // upload image
    if (req.file) {
      image = {
        url: req.file.path,
        public_id:
          req.file.filename,
      };
    }

    const category =
      await Category.create({
        title,

        icon,
  status: status || "active",
        image,
      });

    res.status(201).json({
      success: true,

      message:
        "Category created successfully",

      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};



/* ==============================
   UPDATE CATEGORY
============================== */

export const updateCategory = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    // title duplicate check
    if (
      req.body.title &&
      req.body.title !==
        category.title
    ) {
      const titleExist =
        await Category.findOne({
          title: req.body.title,
          _id: {
            $ne: req.params.id,
          },
        });

      if (titleExist) {
        return res.status(400).json({
          success: false,
          message:
            "Category title already exists",
        });
      }
    }



    /* ==============================
       UPDATE IMAGE
    ============================== */

    if (req.file) {
      // delete old image
      if (
        category.image?.public_id
      ) {
        await cloudinary.uploader.destroy(
          category.image.public_id
        );
      }

      // new image
      category.image = {
        url: req.file.path,
        public_id:
          req.file.filename,
      };
    }


category.status = req.body.status || category.status;
    category.title =
      req.body.title ||
      category.title;

    category.icon =
      req.body.icon ||
      category.icon;

    await category.save();

    res.status(200).json({
      success: true,

      message:
        "Category updated successfully",

      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};



/* ==============================
   GET ALL CATEGORY
============================== */

export const getCategories =async (req, res) => {
    try {
      const categories =
        await Category.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,

        categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };


  export const getActiveCategories =async (req, res) => {
    try {
  const categories = await Category.find({ status: "active" }).sort({
  createdAt: -1,
});

      res.status(200).json({
        success: true,

        categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };



/* ==============================
   DELETE CATEGORY
============================== */

export const deleteCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,

          message:
            "Category not found",
        });
      }

      // delete cloudinary image
      if (
        category.image?.public_id
      ) {
        await cloudinary.uploader.destroy(
          category.image.public_id
        );
      }

      await category.deleteOne();

      res.status(200).json({
        success: true,

        message:
          "Category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };