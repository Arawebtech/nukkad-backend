import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   UPLOAD HELPER (BUFFER)
========================= */

const uploadFromBuffer = (buffer, folder = "gallery") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/* =========================
   CREATE GALLERY
========================= */

export const createGallery = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      desc,
      details,
    } = req.body;

    let parsedDetails = details ? JSON.parse(details) : {};

    /* ---------- COVER IMAGE ---------- */
    let coverImage = {
      url: "",
      public_id: "",
    };

    if (req.files?.coverImage?.[0]) {
      const result = await uploadFromBuffer(
        req.files.coverImage[0].buffer,
        "gallery/cover"
      );

      coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    /* ---------- MULTIPLE IMAGES ---------- */
    let images = [];

    if (req.files?.images?.length > 0) {
      for (const file of req.files.images) {
        const result = await uploadFromBuffer(
          file.buffer,
          "gallery/images"
        );

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const gallery = await Gallery.create({
      title,
      category,
      location,
      desc,
      details: parsedDetails,
      coverImage,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      data: gallery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL
========================= */

export const getAllGallery = async (req, res) => {
  try {
    const data = await Gallery.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveAllGallery = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", status } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // search filter
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { galleryNo: { $regex: search, $options: "i" } },
            { desc: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // status filter (default active only)
    const statusFilter =
      status !== undefined
        ? { status: status === "true" || status === true }
        : { status: true };

    const filter = {
      ...statusFilter,
      ...searchQuery,
    };

    const data = await Gallery.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Gallery.countDocuments(filter);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE
========================= */

export const getSingleGallery = async (req, res) => {
  try {
    const data = await Gallery.findById(req.params.id).populate("category");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE GALLERY
========================= */

export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const {
      title,
      category,
      location,
      desc,
      details,
      status
    } = req.body;

    /* ---------- UPDATE COVER ---------- */
    if (req.files?.coverImage?.[0]) {
      if (gallery.coverImage?.public_id) {
        await cloudinary.uploader.destroy(gallery.coverImage.public_id);
      }

      const result = await uploadFromBuffer(
        req.files.coverImage[0].buffer,
        "gallery/cover"
      );

      gallery.coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    /* ---------- ADD NEW IMAGES ---------- */
    if (req.files?.images?.length > 0) {
      for (const file of req.files.images) {
        const result = await uploadFromBuffer(
          file.buffer,
          "gallery/images"
        );

        gallery.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    gallery.title = title || gallery.title;
    gallery.category = category || gallery.category;
    gallery.location = location || gallery.location;
    gallery.desc = desc || gallery.desc;
    gallery.status = status || gallery.status;
    gallery.details = details ? JSON.parse(details) : gallery.details;

    await gallery.save();

    res.json({
      success: true,
      message: "Gallery updated",
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE GALLERY
========================= */

export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    /* delete cover */
    if (gallery.coverImage?.public_id) {
      await cloudinary.uploader.destroy(gallery.coverImage.public_id);
    }

    /* delete all images */
    for (const img of gallery.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await gallery.deleteOne();

    res.json({
      success: true,
      message: "Gallery deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   TOGGLE STATUS
========================= */

export const toggleStatus = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ message: "Not found" });
    }

    gallery.status = !gallery.status;

    await gallery.save();

    res.json({
      success: true,
      message: "Status updated",
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};