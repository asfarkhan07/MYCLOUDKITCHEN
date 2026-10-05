import { useState } from "react";
import { Link } from "react-router-dom";

const defaultMenuForm = {
  name: "",
  category: "lunch",
  price: "",
  preparationTime: "20",
  description: "",
  vegetarian: true,
  availability: true,
};

export default function MenuManagerPanel({ menuItems = [], kitchens = [], onAddMenuItem, loading = false, showAddForm = true }) {
  const [form, setForm] = useState(defaultMenuForm);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    onAddMenuItem({
      id: `menu-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || "Freshly prepared and ready to serve.",
      price: Number(form.price) || 0,
      preparationTime: Number(form.preparationTime) || 20,
      vegetarian: Boolean(form.vegetarian),
      availability: Boolean(form.availability),
    });

    setForm(defaultMenuForm);
  };

  return (
    <article className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="mini-label dark">Menu</p>
          <h3>{showAddForm ? "Add menu item" : "Menu items"}</h3>
        </div>
        {!showAddForm && (
          <Link className="btn btn-ghost small-button" to="/admin/menu">
            Add menu
          </Link>
        )}
      </div>

      {showAddForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label className="form-field form-field--full">
            <span>Item name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Paneer Tikka Bowl"
            />
          </label>

          <label className="form-field">
            <span>Category</span>
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
              <option value="beverages">Beverages</option>
              <option value="desserts">Desserts</option>
            </select>
          </label>

          <label className="form-field">
            <span>Price</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            />
          </label>

          <label className="form-field">
            <span>Prep time</span>
            <input
              type="number"
              min="5"
              value={form.preparationTime}
              onChange={(event) => setForm((current) => ({ ...current, preparationTime: event.target.value }))}
            />
          </label>

          <label className="form-field form-field--full">
            <span>Description</span>
            <textarea
              rows="3"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Describe the menu item"
            />
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.vegetarian}
              onChange={(event) => setForm((current) => ({ ...current, vegetarian: event.target.checked }))}
            />
            <span>Vegetarian</span>
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.availability}
              onChange={(event) => setForm((current) => ({ ...current, availability: event.target.checked }))}
            />
            <span>Available</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Add menu item
        </button>
        </form>
      )}

      <div className="menu-table admin-menu-table">
        {loading ? (
          <div className="empty-state" role="status">Loading menu items...</div>
        ) : menuItems.length ? (
          menuItems.map((item) => {
            const itemKitchenId = String(
              item.kitchen?._id || item.kitchen?.id || item.kitchen || "",
            );
            const kitchenName = kitchens.find(
              (kitchen) => String(kitchen._id || kitchen.id) === itemKitchenId,
            )?.name;

            return (
              <div className="menu-row" key={item._id || item.id}>
                <div>
                  <strong>{item.name}</strong>
                  {kitchenName && <small>{kitchenName}</small>}
                </div>
                <span>₹{item.price}</span>
                <small>{item.availability ? "Available" : "Hidden"}</small>
              </div>
            );
          })
        ) : (
          <div className="empty-state">No menu items yet.</div>
        )}
      </div>
    </article>
  );
}
