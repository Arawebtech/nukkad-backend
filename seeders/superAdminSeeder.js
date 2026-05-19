import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";

import Admin from "../models/Admin.js";

connectDB();

const seedSuperAdmin = async () => {
  try {
    // only one admin allowed
    const adminExist = await Admin.findOne();

    if (adminExist) {
      console.log("Only one super admin allowed");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10
    );

    const admin = await Admin.create({
      name: process.env.SUPER_ADMIN_NAME,

      email: process.env.SUPER_ADMIN_EMAIL,

      password: hashedPassword,

      phone: process.env.SUPER_ADMIN_PHONE,

      address: process.env.SUPER_ADMIN_ADDRESS,

      companyName: process.env.SUPER_ADMIN_COMPANY,

      role: "superadmin",

      comment: "",

      companyLogo: {
        url: "",
        public_id: "",
      },

      userDp: {
        url: "",
        public_id: "",
      },
    });

    console.log("Super Admin Created");

    console.log(admin);

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit();
  }
};

seedSuperAdmin();