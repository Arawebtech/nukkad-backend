import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import cloudinary from "../config/cloudinary.js";

export const loginAdmin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const admin =
      await Admin.findOne({
        email,
      });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!match) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );



    // REMOVE PASSWORD
    const adminData =
      admin.toObject();

    delete adminData.password;



    res.status(200).json({
      success: true,

      token,

      admin: adminData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};



export const createAdmin = async (req, res) => {
  try {
    // only 2 admins allowed
    const adminCount =
      await Admin.countDocuments();

    if (adminCount >= 2) {
      return res.status(400).json({
        success: false,
        message:
          "Already 2 admins created",
      });
    }

    const {
      name,
      email,
      password,
      phone,
      address,
      companyName,
      comment,
    } = req.body;

    // email check
    const emailExist =
      await Admin.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    let companyLogo = {
      url: "",
      public_id: "",
    };

    let userDp = {
      url: "",
      public_id: "",
    };

    // company logo upload
if (req.files?.companyLogo) {
  if (admin.companyLogo?.public_id) {
    await cloudinary.uploader.destroy(admin.companyLogo.public_id);
  }

  admin.companyLogo = {
    url: req.files.companyLogo[0].path,
    public_id: req.files.companyLogo[0].filename,
  };
}

    // user dp upload
    if (req.files?.userDp) {
      const result =
        await cloudinary.uploader.upload(
          req.files.userDp[0].path,
          {
            folder: "admins/userDp",
          }
        );

      userDp = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      companyName,
      comment,
      companyLogo,
      userDp,
    });

    res.status(201).json({
      success: true,
      message: "Admin Created",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





const uploadFromBuffer = (buffer, folder) => {
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

export const updateAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const {
      name,
      phone,
      companyName,
      address,
    } = req.body;

    /* ================= BASIC FIELDS ================= */

    if (name) admin.name = name;

    if (phone) admin.phone = phone;

    if (companyName)
      admin.companyName = companyName;

    if (address)
      admin.address = address;

    /* ================= COMPANY LOGO ================= */

    if (req.files?.companyLogo?.[0]) {
      const file =
        req.files.companyLogo[0];

      // OLD DELETE
      if (admin.companyLogo?.public_id) {
        await cloudinary.uploader.destroy(
          admin.companyLogo.public_id
        );
      }

      // NEW UPLOAD
      const result =
        await uploadFromBuffer(
          file.buffer,
          "admins/companyLogo"
        );

      admin.companyLogo = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    /* ================= USER DP ================= */

    if (req.files?.userDp?.[0]) {
      const file =
        req.files.userDp[0];

      // OLD DELETE
      if (admin.userDp?.public_id) {
        await cloudinary.uploader.destroy(
          admin.userDp.public_id
        );
      }

      // NEW UPLOAD
      const result =
        await uploadFromBuffer(
          file.buffer,
          "admins/userDp"
        );

      admin.userDp = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      admin,
    });
  } catch (error) {
    console.log(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ================= UPDATE ADMIN PROFILE ================= */
// export const updateAdmin = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILES:", req.files);
//     const adminId = req.admin.id;
//     const admin = await Admin.findById(adminId);

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: "Admin not found",
//       });
//     }

//     const { name, phone, companyName, address } = req.body;

//     /* ================= UPDATE BASIC FIELDS ================= */
//     if (name) admin.name = name;
//     if (phone) admin.phone = phone;
//     if (companyName) admin.companyName = companyName;
//     if (address) admin.address = address;

//     /* ================= COMPANY LOGO ================= */
// if (req.files?.companyLogo) {
//   if (admin.companyLogo?.public_id) {
//     await cloudinary.uploader.destroy(admin.companyLogo.public_id);
//   }

//   admin.companyLogo = {
//     url: req.files.companyLogo[0].path,
//     public_id: req.files.companyLogo[0].filename,
//   };
// }

//     /* ================= USER DP ================= */
//     if (req.files?.userDp) {
//       if (admin.userDp?.public_id) {
//         await cloudinary.uploader.destroy(admin.userDp.public_id);
//       }

//       const result = await cloudinary.uploader.upload(
//         req.files.userDp[0].path,
//         {
//           folder: "admins/userDp",
//         }
//       );

//       admin.userDp = {
//         url: result.secure_url,
//         public_id: result.public_id,
//       };
//     }

//     await admin.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       admin,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const updateAdmin = async (req, res) => {
//   try {


//   const adminId = req.user.id;

//     const admin = await Admin.findById(adminId);

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: "Admin not found",
//       });
//     }

//     const { name, phone, companyName, address } = req.body;

//     /* ================= BASIC FIELDS ================= */
//     if (name) admin.name = name;
//     if (phone) admin.phone = phone;
//     if (companyName) admin.companyName = companyName;
//     if (address) admin.address = address;

//     /* ================= COMPANY LOGO (CLOUD ONLY) ================= */
//     if (req.files?.companyLogo?.[0]) {
//       const file = req.files.companyLogo[0];

//       if (admin.companyLogo?.public_id) {
//         await cloudinary.uploader.destroy(admin.companyLogo.public_id);
//       }

//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "admins/companyLogo",
//       });

//       admin.companyLogo = {
//         url: result.secure_url,
//         public_id: result.public_id,
//       };
//     }

//     /* ================= USER DP (CLOUD ONLY) ================= */
//     if (req.files?.userDp?.[0]) {
//       const file = req.files.userDp[0];

//       if (admin.userDp?.public_id) {
//         await cloudinary.uploader.destroy(admin.userDp.public_id);
//       }

//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "admins/userDp",
//       });

//       admin.userDp = {
//         url: result.secure_url,
//         public_id: result.public_id,
//       };
//     }

//     await admin.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       admin,
//     });
//   } catch (error) {
//     console.log("UPLOAD ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



export const updatePassword = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { email, oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

  
    /* ================= EMAIL CHECK ================= */
    if (email && email !== admin.email) {
      return res.status(400).json({
        success: false,
        message: "Email mismatch",
      });
    }

    /* ================= OLD PASSWORD CHECK ================= */
    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

          if (!newPassword) {
      return res.status(404).json({
        success: false,
        message: "New Password Is  Empty",
      });
    }

    /* ================= UPDATE PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};