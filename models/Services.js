import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema({
  text: String,
});

const processStepSchema = new mongoose.Schema({
  num: String,
  title: String,
  desc: String,
});

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const sectionSchema = new mongoose.Schema({
  title: String,
  title2Text: String,
  showTitle2: {
    type: Boolean,
    default: true,
  },
  paragraphs: [paragraphSchema],
});

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Minimum 3 characters required"],
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ── Thumbnail ──────────────────────────────────
    thumbnail: {
      imageUrl: String,
      publicId: String,
    },
    // ──────────────────────────────────────────────

    heroBanner: {
      image: String,
      publicId: String,
      heading: String,
      description: String,
      text: String,
    },

    // ── Background Image (desktop) ─────────────────
    backgroundImage: {
      imageUrl: String,
      publicId: String,
    },
    // ──────────────────────────────────────────────

    // ── Background Image (mobile) ──────────────────
    backgroundImageMobile: {
      imageUrl: String,
      publicId: String,
    },
    // ──────────────────────────────────────────────

    headingDesc: [sectionSchema],

    processSection: {
      title: String,
      title2Text: String,
      showTitle2: {
        type: Boolean,
        default: true,
      },
      description: String,
      steps: [processStepSchema],
    },

    faqSection: {
      title: String,
      title2Text: String,
      showTitle2: {
        type: Boolean,
        default: true,
      },
      faqs: [faqSchema],
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Services", serviceSchema);