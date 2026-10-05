import ApiError from "../utils/ApiError.utils.js";
import Kitchen from "../models/kitchen.model.js";
import Menu from "../models/menu.model.js";

const buildOrderData = async (customerId, body) => {
  const { kitchenId, items, deliveryAddress, paymentMethod } = body;

  if (!kitchenId || !items?.length || !deliveryAddress || !paymentMethod) {
    throw new ApiError(400, "please fill all the required fields");
  }
  for (const field of ["street", "city", "state", "zipCode", "country", "phoneNumber"]) {
    if (!deliveryAddress[field]) {
      throw new ApiError(400, `${field} is required`);
    }
  }

  const kitchen = await Kitchen.findById(kitchenId);
  if (!kitchen) throw new ApiError(404, "kitchen not found");
  if (kitchen.status === "inactive" || kitchen.status === "closed") {
    throw new ApiError(400, "kitchen is currently closed");
  }

  const orderItems = [];
  let subtotal = 0;
  const menuItems = await Menu.find({
    _id: { $in: items.map((item) => item.menuItem) },
  });
  const menuItemsById = new Map(
    menuItems.map((menuItem) => [String(menuItem._id), menuItem]),
  );

  for (const item of items) {
    const menuItem = menuItemsById.get(String(item.menuItem));
    if (!menuItem) throw new ApiError(404, `menuItem ${item.menuItem} not found`);
    if (menuItem.kitchen.toString() !== String(kitchenId)) {
      throw new ApiError(400, "all items must belong to the same kitchen");
    }
    if (!menuItem.availability) {
      throw new ApiError(400, `${menuItem.name} is not available`);
    }

    const quantity = Number(item.quantity) || 1;
    if (quantity < 1) throw new ApiError(400, "quantity must be at least 1");
    subtotal += quantity * menuItem.price;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    });
  }

  const deliveryCharge = kitchen.deliveryCharge || 0;

  return {
    customer: customerId,
    kitchen: kitchenId,
    items: orderItems,
    deliveryAddress,
    subtotal,
    deliveryCharge,
    totalAmount: subtotal + deliveryCharge,
    paymentMethod,
  };
};

export default buildOrderData;