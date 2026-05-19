import Service from "../models/Service.js";

import cloudinary from "../config/cloudinary.js";
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "services",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

export const createService = async (
  req,
  res
) => {
  try {
    const {
      title,
      icon,
      shortDesc,
      desc,
      category,
      mixed,
      status
    } = req.body;

    const alreadyExist =
      await Service.findOne({
        title,
      });

    if (alreadyExist) {
      return res.status(400).json({
        success: false,
        message:
          "Service already exists",
      });
    }

  let image = {
  url: "",
  public_id: "",
};

if (req.file) {
  const result = await uploadFromBuffer(req.file.buffer);

  image = {
    url: result.secure_url,
    public_id: result.public_id,
  };
}
    

    const service =
      await Service.create({
        title,
        icon,
        shortDesc,
        desc,
        category,
        status: status || "active",

        mixed: mixed
          ? JSON.parse(mixed)
          : [],

        image,
      });

    res.status(201).json({
      success: true,
      data: service,
      message:"Services Added Successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateService = async (
  req,
  res
) => {
  try {
    const service =
      await Service.findById(
        req.params.id
      );

console.log("id ",req.params.id)
console.log("body",req.file)

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

if (req.file) {
  // old image delete
  if (service.image?.public_id) {
    await cloudinary.uploader.destroy(service.image.public_id);
  }

  // new upload to cloudinary
  const result = await uploadFromBuffer(req.file.buffer);

  service.image = {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

   

    service.title =
      req.body.title || service.title;

    service.icon =
      req.body.icon || service.icon;
      service.status =
  req.body.status || service.status;

    service.shortDesc =
      req.body.shortDesc ||
      service.shortDesc;

    service.desc =
      req.body.desc || service.desc;

    service.category =
      req.body.category ||
      service.category;

    service.mixed = req.body.mixed
      ? JSON.parse(req.body.mixed)
      : service.mixed;

    await service.save();

    res.status(200).json({
      success: true,
      message: "Updated",
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
    const services = await Service.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getActiveServices = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // search filter
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { shortDesc: { $regex: search, $options: "i" } },
            { serviceNo: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // only active services + search
    const filter = {
      status: "active",
      ...searchQuery,
    };

    const services = await Service.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
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


export const deleteService = async (
  req,
  res
) => {
  try {
    const service =
      await Service.findById(
        req.params.id
      );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    // delete image only if exists
    if (
      service.image &&
      service.image.public_id
    ) {
      await cloudinary.uploader.destroy(
        service.image.public_id
      );
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};