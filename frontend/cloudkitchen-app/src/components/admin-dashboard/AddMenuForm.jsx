import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyKitchens } from "../../redux/slices/kitchenSlice.js";
import { createMenu } from "../../redux/slices/menuSlice.js";
import { showErrorAlert, showSuccessAlert } from "../../utils/sweetAlert.js";

const initialForm = {
  name: "",
  category: "lunch",
  price: "",
  preparationTime: "20",
  description: "",
  vegetarian: false,
  availability: true,
};

const categories = ["breakfast", "lunch", "dinner", "snacks", "beverages", "desserts"];

export default function AddMenuForm() {
  const dispatch = useDispatch();
  const { kitchens = [], loading: kitchensLoading } = useSelector(
    (state) => state.kitchen,
  );
  const [selectedKitchenId, setSelectedKitchenId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedKitchens = useRef(false);

  useEffect(() => {
    if (!kitchens.length && !kitchensLoading && !requestedKitchens.current) {
      requestedKitchens.current = true;
      dispatch(getMyKitchens());
    }
  }, [dispatch, kitchens.length, kitchensLoading]);

  const activeKitchenId = selectedKitchenId || String(kitchens[0]?._id || kitchens[0]?.id || "");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!activeKitchenId) {
      void showErrorAlert("Select a kitchen before adding a menu item.");
      return;
    }

    const menuData = new FormData();
    menuData.append("name", form.name.trim());
    menuData.append("description", form.description.trim());
    menuData.append("category", form.category);
    menuData.append("price", form.price);
    menuData.append("preparationTime", form.preparationTime);
    menuData.append("vegetarian", String(form.vegetarian));
    menuData.append("availability", String(form.availability));
    if (image) menuData.append("image", image);

    setIsSubmitting(true);
    try {
      await dispatch(
        createMenu({ kitchenId: activeKitchenId, menuData }),
      ).unwrap();
      void showSuccessAlert("Menu item added successfully.");
      setForm(initialForm);
      setImage(null);
      formElement.reset();
    } catch (error) {
      console.error("Menu item creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (kitchensLoading && !kitchens.length) {
    return <p className="admin-kitchens-message" role="status">Loading your kitchens...</p>;
  }

  if (!kitchens.length) {
    return (
      <div className="add-menu-empty">
        <p className="admin-kitchens-message">Create a kitchen before adding menu items.</p>
        <Link className="btn btn-primary" to="/kitchen">Create a kitchen</Link>
      </div>
    );
  }

  return (
    <form className="admin-form add-menu-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="form-field form-field--full">
          <span>Kitchen</span>
          <select
            required
            value={activeKitchenId}
            onChange={(event) => setSelectedKitchenId(event.target.value)}
          >
            {kitchens.map((kitchen) => {
              const kitchenId = String(kitchen._id || kitchen.id);
              return <option key={kitchenId} value={kitchenId}>{kitchen.name}</option>;
            })}
          </select>
        </label>

        <label className="form-field form-field--full">
          <span>Item name</span>
          <input
            required
            minLength="2"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Paneer Tikka Bowl"
          />
        </label>

        <label className="form-field">
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Price</span>
          <input
            required
            min="0"
            step="0.01"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </label>

        <label className="form-field">
          <span>Preparation time (minutes)</span>
          <input
            required
            min="5"
            name="preparationTime"
            type="number"
            value={form.preparationTime}
            onChange={handleChange}
          />
        </label>

        <label className="form-field form-field--full">
          <span>Description</span>
          <textarea
            required
            rows="3"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the menu item"
          />
        </label>

        <label className="form-field form-field--full">
          <span>Menu image</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
        </label>

        <label className="checkbox-field">
          <input
            name="vegetarian"
            type="checkbox"
            checked={form.vegetarian}
            onChange={handleChange}
          />
          <span>Vegetarian</span>
        </label>

        <label className="checkbox-field">
          <input
            name="availability"
            type="checkbox"
            checked={form.availability}
            onChange={handleChange}
          />
          <span>Available</span>
        </label>
      </div>

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding menu item..." : "Add menu item"}
      </button>
    </form>
  );
}