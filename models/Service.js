import mongoose from "mongoose";



/* =================================
   GENERATE UNIQUE NUMBER
================================= */

const generateUniqueNumber = () => {
  // last 6 digit from timestamp
  return Date.now()
    .toString()
    .slice(-6);
};



const serviceSchema = new mongoose.Schema(
  {
    serviceNo: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
    },

    shortDesc: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    mixed: [
      {
        title: {
          type: String,
          default: "",
        },

        value: {
          type: String,
          default: "",
        },
      },
    ],

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

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},
  },
  {
    timestamps: true,
  }
);



/* =================================
   AUTO SERVICE NUMBER
================================= */

serviceSchema.pre(
  "save",
  async function () {
    if (!this.serviceNo) {
      let isUnique = false;

      while (!isUnique) {
        const generatedNo = `NN${generateUniqueNumber()}`;

        const existing =
          await mongoose.models.Service.findOne({
            serviceNo: generatedNo,
          });

        if (!existing) {
          this.serviceNo =
            generatedNo;

          isUnique = true;
        }
      }
    }
  }
);

const Service = mongoose.model(
  "Service",
  serviceSchema
);

export default Service;