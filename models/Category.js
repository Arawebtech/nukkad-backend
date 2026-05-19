import mongoose from "mongoose";

/* ==============================
   GENERATE UNIQUE CATEGORY NO
============================== */

const generateUniqueNumber =
  () => {
    return Date.now()
      .toString()
      .slice(-6);
  };

const categorySchema =
  new mongoose.Schema(
    {
      categoryNo: {
        type: String,
        unique: true,
      },

      title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      icon: {
        type: String,
        default: "",
      },

      status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},
      image: {
        url: {
          type: String,
          default: "",
        },

        public_id: {
          type: String,
          default: "",
        },
      },
    },
    {
      timestamps: true,
    }
  );

/* ==============================
   AUTO CATEGORY NUMBER
============================== */

categorySchema.pre(
  "save",
  async function () {
    if (!this.categoryNo) {
      let isUnique = false;

      while (!isUnique) {
        const generatedNo = `CAT${generateUniqueNumber()}`;

        const existing =
          await mongoose.models.Category.findOne(
            {
              categoryNo:
                generatedNo,
            }
          );

        if (!existing) {
          this.categoryNo =
            generatedNo;

          isUnique = true;
        }
      }
    }
  }
);

const Category =
  mongoose.model(
    "Category",
    categorySchema
  );

export default Category;