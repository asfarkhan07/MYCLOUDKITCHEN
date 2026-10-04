const validateMenuItem = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be atleast 2 characters");
  }

  if (price === undefined || price < 0) {
    errors.push("Price must be a non-negative number");
  }

  const validCategories = [
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
    "beverages",
    "desserts",
  ];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be of ${validCategories.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export { validateMenuItem };
