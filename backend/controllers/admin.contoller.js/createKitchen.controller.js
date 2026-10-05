import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Kitchen from "../../models/kitchen.model.js";
import uploadImage from "../../utils/uploadImage.utils.js";

const createKitchen = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    cuisineType,
    street = "",
    city,
    state,
    country,
    zipCode = "",
    contactNumber,
    deliveryRadius,
    status,
    verified,
  } = req.body;

  if (!name || !city || !state || !country || !contactNumber) {
    throw new ApiError(
      400,
      "Kitchen name, city, state, country and contact number are required",
    );
  }

  const normalisedCuisine = Array.isArray(cuisineType)
    ? cuisineType
    : String(cuisineType || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const kitchenData = {
    name,
    owner: req.user.id,
    description: description || "Freshly prepared meals for every craving.",
    cuisineType: normalisedCuisine.length ? normalisedCuisine : ["General"],
    address: {
      street: street || "",
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode || "",
      country: country.trim(),
    },
    contactNumber,
    deliveryRadius: Number(deliveryRadius) || 8,
    status: status || "active",
    verified: Boolean(verified),
    menuItems: [],
  };

  if (req.file) {
    const imageResult = await uploadImage(req.file.buffer, "kitchens");
    kitchenData.image = imageResult;
  }

  const kitchen = await Kitchen.create(kitchenData);

  res.status(201).json({ message: "Kitchen created successfully", kitchen });
});

export default createKitchen;
