import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    kitchen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
    },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks", "beverages", "desserts"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    availability: {
      type: Boolean,
      default: true,
    },
    vegetarian: {
      type: Boolean,
      default: false,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    preparationTime: {
      type: Number, // in minutes
      required: true,
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
