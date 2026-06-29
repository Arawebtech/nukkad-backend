import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Service from "../models/Services.js";

const uploadFromBuffer = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

export const createService = async (req, res) => {
  try {
    const { name, slug } = req.body;

    console.log(req.files);

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existingService = await Service.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // ── Hero banner image (field name: "image") ──
    let heroBanner = {};

    if (req.files?.image?.[0]) {
      const result = await uploadFromBuffer(
        req.files.image[0],
        "services/hero"
      );

      heroBanner = {
        image: result.secure_url,
        publicId: result.public_id,
      };
    }

    // ── Thumbnail image (field name: "thumbnail") ──
    let thumbnail = {};

    if (req.files?.thumbnail?.[0]) {
      const result = await uploadFromBuffer(
        req.files.thumbnail[0],
        "services/thumbnails"
      );

      thumbnail = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    // ── Background Image — desktop (field name: "backgroundImage") ──
    let backgroundImage = {};

    if (req.files?.backgroundImage?.[0]) {
      const result = await uploadFromBuffer(
        req.files.backgroundImage[0],
        "services/backgrounds"
      );

      backgroundImage = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    // ── Background Image — mobile (field name: "backgroundImageMobile") ──
    let backgroundImageMobile = {};

    if (req.files?.backgroundImageMobile?.[0]) {
      const result = await uploadFromBuffer(
        req.files.backgroundImageMobile[0],
        "services/backgrounds/mobile"
      );

      backgroundImageMobile = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    const service = await Service.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),

      thumbnail,
      backgroundImage,
      backgroundImageMobile,

      heroBanner: {
        ...JSON.parse(req.body.heroBanner || "{}"),
        ...heroBanner,
      },

      headingDesc: JSON.parse(req.body.headingDesc || "[]"),
      processSection: JSON.parse(req.body.processSection || "{}"),
      faqSection: JSON.parse(req.body.faqSection || "{}"),
      seo: JSON.parse(req.body.seo || "{}"),
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const active = req.query.active;

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (active !== undefined) {
      query.active = active === "true";
    }

    const [services, total] = await Promise.all([
      Service.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Service.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveServices = async (req, res) => {
  try {
    const search = req.query.search || "";

    let query = {
      active: true,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const services = await Service.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Service ID" });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      active: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Service ID" });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // ── Hero banner ──
    const heroBannerBody = JSON.parse(req.body.heroBanner || "{}");

    let heroBanner = {
      ...service.heroBanner,
      ...heroBannerBody,
    };

    if (req.files?.image?.[0]) {
      if (service.heroBanner?.publicId) {
        await cloudinary.uploader.destroy(service.heroBanner.publicId);
      }

      const result = await uploadFromBuffer(
        req.files.image[0],
        "services/hero"
      );

      heroBanner.image = result.secure_url;
      heroBanner.publicId = result.public_id;
    }

    // ── Thumbnail ──
    let thumbnail = service.thumbnail;

    if (req.files?.thumbnail?.[0]) {
      if (service.thumbnail?.publicId) {
        await cloudinary.uploader.destroy(service.thumbnail.publicId);
      }

      const result = await uploadFromBuffer(
        req.files.thumbnail[0],
        "services/thumbnails"
      );

      thumbnail = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Clear thumbnail
    if (req.body.clearThumbnail === "true" && service.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(service.thumbnail.publicId);
      thumbnail = {};
    }

    // ── Background Image — desktop ──
    let backgroundImage = service.backgroundImage;

    if (req.files?.backgroundImage?.[0]) {
      if (service.backgroundImage?.publicId) {
        await cloudinary.uploader.destroy(service.backgroundImage.publicId);
      }

      const result = await uploadFromBuffer(
        req.files.backgroundImage[0],
        "services/backgrounds"
      );

      backgroundImage = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Clear background image
    if (req.body.clearBackgroundImage === "true" && service.backgroundImage?.publicId) {
      await cloudinary.uploader.destroy(service.backgroundImage.publicId);
      backgroundImage = {};
    }

    // ── Background Image — mobile ──
    let backgroundImageMobile = service.backgroundImageMobile;

    if (req.files?.backgroundImageMobile?.[0]) {
      if (service.backgroundImageMobile?.publicId) {
        await cloudinary.uploader.destroy(service.backgroundImageMobile.publicId);
      }

      const result = await uploadFromBuffer(
        req.files.backgroundImageMobile[0],
        "services/backgrounds/mobile"
      );

      backgroundImageMobile = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Clear background image mobile
    if (req.body.clearBackgroundImageMobile === "true" && service.backgroundImageMobile?.publicId) {
      await cloudinary.uploader.destroy(service.backgroundImageMobile.publicId);
      backgroundImageMobile = {};
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        heroBanner,
        thumbnail,
        backgroundImage,
        backgroundImageMobile,
        headingDesc: JSON.parse(req.body.headingDesc || "[]"),
        processSection: JSON.parse(req.body.processSection || "{}"),
        faqSection: JSON.parse(req.body.faqSection || "{}"),
        seo: JSON.parse(req.body.seo || "{}"),
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Service ID" });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Delete all Cloudinary assets
    if (service.heroBanner?.publicId) {
      await cloudinary.uploader.destroy(service.heroBanner.publicId);
    }

    if (service.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(service.thumbnail.publicId);
    }

    if (service.backgroundImage?.publicId) {
      await cloudinary.uploader.destroy(service.backgroundImage.publicId);
    }

    if (service.backgroundImageMobile?.publicId) {
      await cloudinary.uploader.destroy(service.backgroundImageMobile.publicId);
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};