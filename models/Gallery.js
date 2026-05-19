import mongoose from "mongoose";

/* =================================
   GENERATE UNIQUE NUMBER
================================= */

const generateUniqueNumber = () => {
  return Date.now().toString().slice(-6);
};

/* =================================
   IMAGE SCHEMA
================================= */

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" },
  },
  { _id: false }
);

/* =================================
   GALLERY SCHEMA
================================= */

const gallerySchema = new mongoose.Schema(
  {
    galleryNo: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: true, // toggle ON/OFF
    },

    details: {
      completed: { type: Boolean, default: false },
      clientName: { type: String, default: "" },
      budget: { type: Number, default: 0 },
      year: { type: Number, default: new Date().getFullYear() },
    },

    images: [imageSchema], // multiple images

    coverImage: imageSchema, // optional main image
  },
  {
    timestamps: true,
  }
);

/* =================================
   AUTO GALLERY NUMBER
================================= */

gallerySchema.pre("save", async function () {
  if (!this.galleryNo) {
    let isUnique = false;

    while (!isUnique) {
      const generatedNo = `GL${generateUniqueNumber()}`;

      const existing = await mongoose.models.Gallery.findOne({
        galleryNo: generatedNo,
      });

      if (!existing) {
        this.galleryNo = generatedNo;
        isUnique = true;
      }
    }
  }
});

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;