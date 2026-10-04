import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisineType: [
      {
        type: String,
        required: true,
      },
    ],
    address: {
      street: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        required: true,
      },
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    contactNumber: {
      type: String,
      required: true,
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
    menuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
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
    deliveryRadius: {
      type: Number, // in km
      default: 5,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Kitchen = mongoose.model("Kitchen", kitchenSchema);

export default Kitchen;