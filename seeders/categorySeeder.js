import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Category from "../models/Category.js";

connectDB();

const categories = [
  {
    title: "Folk Artist",
    icon: "music",
  },
  {
    title: "Nukkad Natak",
    icon: "mic",
  },
  {
    title: "Theatre",
    icon: "theater",
  },
  {
    title: "Dance",
    icon: "party-popper",
  },
];

const seedCategories = async () => {
  try {
    const existingCategories = await Category.countDocuments();

    if (existingCategories > 0) {
      console.log("Categories already seeded");
      process.exit();
    }

    const formattedCategories = categories.map((item) => ({
      ...item,
      image: {
        url: "",
        public_id: "",
      },
    }));

    // ✅ SAFE INSERT (hooks will run)
    for (let item of formattedCategories) {
      const category = new Category(item);
      await category.save();
    }

    console.log("Categories Seeded Successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedCategories();