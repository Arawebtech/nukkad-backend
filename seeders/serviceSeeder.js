import dotenv from "dotenv";

dotenv.config();

import connectDB from "../config/db.js";

import Category from "../models/Category.js";

import Service from "../models/Service.js";

connectDB();



const seedServices = async () => {
  try {
    // already seeded check
    const existingServices =
      await Service.countDocuments();

    if (existingServices > 0) {
      console.log(
        "Services already seeded"
      );

      process.exit();
    }



    /* =========================
       GET CATEGORIES
    ========================= */

    const folkArtist =
      await Category.findOne({
        title: "Folk Artist",
      });

    const nukkadNatak =
      await Category.findOne({
        title: "Nukkad Natak",
      });

    const theatre =
      await Category.findOne({
        title: "Theatre",
      });

    const dance =
      await Category.findOne({
        title: "Dance",
      });




    /* =========================
       SERVICES DATA
    ========================= */

    const services = [
      {
        title:
          "Traditional Folk Dance",

        icon: "music",

        shortDesc:
          "Professional folk dance performance",

        desc:
          "We provide professional traditional folk dance artists for events, schools, festivals, and cultural programs.",

        category:
          folkArtist?._id,

        mixed: [
          {
            title:
              "Performance Time",

            value: "30 Minutes",
          },

          {
            title:
              "Artist Count",

            value: "10 Artists",
          },
        ],

        image: {
          url: "",
          public_id: "",
        },
      },

      {
        title:
          "Street Play Performance",

        icon: "theater",

        shortDesc:
          "Social awareness street play",

        desc:
          "Professional nukkad natak team available for awareness campaigns, schools, NGOs, and government events.",

        category:
          nukkadNatak?._id,

        mixed: [
          {
            title: "Language",

            value: "Hindi",
          },

          {
            title: "Duration",

            value: "25 Minutes",
          },
        ],

        image: {
          url: "",
          public_id: "",
        },
      },

      {
        title:
          "Stage Theatre Show",

        icon: "drama",

        shortDesc:
          "Complete theatre production",

        desc:
          "Professional theatre artists and production services for stage performances and live events.",

        category:
          theatre?._id,

        mixed: [
          {
            title:
              "Stage Setup",

            value: "Included",
          },

          {
            title: "Lights",

            value: "Included",
          },
        ],

        image: {
          url: "",
          public_id: "",
        },
      },

      {
        title:
          "Wedding Dance Group",

        icon: "dance",

        shortDesc:
          "Dance group for weddings",

        desc:
          "Professional dance group available for weddings, sangeet, and special celebrations.",

        category:
          dance?._id,

        mixed: [
          {
            title: "Team Size",

            value: "15 Members",
          },

          {
            title: "Songs",

            value: "Custom",
          },
        ],

        image: {
          url: "",
          public_id: "",
        },
      },
    ];



    /* =========================
       INSERT SERVICES
    ========================= */

    await Service.insertMany(
      services
    );

    console.log(
      "Services Seeded Successfully"
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit();
  }
};

seedServices();