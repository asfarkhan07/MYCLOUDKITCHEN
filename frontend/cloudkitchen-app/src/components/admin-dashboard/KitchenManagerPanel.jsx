import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreateKitchen, getMyKitchens } from "../../redux/slices/kitchenSlice.js";

const defaultKitchenForm = {
  name: "",
  description: "",
  cuisineType: "North Indian",
  city: "Hyderabad",
  state: "Telangana",
  country: "India",
  contactNumber: "",
  deliveryRadius: "8",
  status: "active",
};

export default function KitchenManagerPanel({ showStandaloneHeader = false, showCreateForm = true }) {
  const [form, setForm] = useState(defaultKitchenForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const dispatch = useDispatch();
  const { kitchens = [], loading: kitchensLoading, error: kitchensError } = useSelector((state) => state.kitchen);

  useEffect(() => {
    dispatch(getMyKitchens());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        CreateKitchen({
          name: form.name.trim(),
          description: form.description,
          cuisineType: form.cuisineType || "North Indian",
          city: form.city || "Hyderabad",
          state: form.state || "Telangana",
          country: form.country || "India",
          contactNumber: form.contactNumber || "",
          deliveryRadius: form.deliveryRadius || "8",
          status: form.status || "active",
          image: imageFile,
        }),
      ).unwrap();
      await dispatch(getMyKitchens()).unwrap();
      setForm(defaultKitchenForm);
      setImageFile(null);
      setImagePreviewUrl("");
    } catch (error) {
      console.error("Kitchen create failed:", error);
    }
  };

  return (
    <div className={`kitchen-manager-stack${showStandaloneHeader ? " kitchen-manager-stack--wide" : ""}`}>
      {showStandaloneHeader && (
        <Link to="/admin" className="btn btn-ghost nav-action-link kitchen-manager-back">
          ← Back to dashboard
        </Link>
      )}

      {showCreateForm && (
        <article className="dashboard-panel kitchen-manager-panel">
          <div className="dashboard-panel__header kitchen-manager-panel__header">
            <div>
              <p className="mini-label dark">Kitchen</p>
              <h3>Create kitchen</h3>
            </div>
          </div>

          <form className="admin-form kitchen-manager-form" onSubmit={handleSubmit}>
            <div className="field-grid kitchen-manager-field-grid">
              <label className="form-field form-field--full">
                <span>Kitchen name</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Saffron Crave" />
              </label>

              <label className="form-field form-field--full">
                <span>Description</span>
                <textarea rows="3" name="description" value={form.description} onChange={handleChange} placeholder="Describe your kitchen" />
              </label>

              <label className="form-field form-field--full">
                <span>Kitchen image</span>
                <div className="image-upload-box">
                  <input type="file" name="image" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Kitchen preview" className="image-preview" />
                  ) : (
                    <span className="upload-placeholder">Upload kitchen photo</span>
                  )}
                </div>
              </label>

              <label className="form-field">
                <span>Cuisine types</span>
                <input type="text" name="cuisineType" value={form.cuisineType} onChange={handleChange} placeholder="North Indian, Biryani" />
              </label>

              <label className="form-field">
                <span>Status</span>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Open</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </label>

              <label className="form-field">
                <span>City</span>
                <input type="text" name="city" value={form.city} onChange={handleChange} />
              </label>

              <label className="form-field">
                <span>State</span>
                <input type="text" name="state" value={form.state} onChange={handleChange} />
              </label>

              <label className="form-field">
                <span>Country</span>
                <input type="text" name="country" value={form.country} onChange={handleChange} />
              </label>

              <label className="form-field">
                <span>Radius (km)</span>
                <input type="number" name="deliveryRadius" min="1" value={form.deliveryRadius} onChange={handleChange} />
              </label>

              <label className="form-field form-field--full">
                <span>Contact number</span>
                <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="+91 98765 43210" />
              </label>
            </div>

            <button type="submit" className="btn btn-primary">Save kitchen</button>
          </form>
        </article>
      )}

      <article className="dashboard-panel admin-kitchens-panel" aria-label="Your kitchens">
        <div className="dashboard-panel__header">
          <div>
            <p className="mini-label dark">Kitchen portfolio</p>
            <h3>Your kitchens</h3>
          </div>
          <span className="admin-kitchens-count">{kitchens.length}</span>
        </div>

        {kitchensLoading ? (
          <p className="admin-kitchens-message" role="status">Loading kitchens...</p>
        ) : kitchensError ? (
          <p className="admin-kitchens-message" role="alert">{kitchensError}</p>
        ) : kitchens.length ? (
          <div className="admin-kitchen-list">
            {kitchens.map((item) => {
              const kitchenId = String(item._id || item.id);

              return (
                <Link className="admin-kitchen-item" to={`/kitchen/${encodeURIComponent(kitchenId)}`} key={kitchenId}>
                  <span className="admin-kitchen-item__text">
                    <strong>{item.name}</strong>
                    <small>
                      {[...(item.cuisineType || []), item.address?.city].filter(Boolean).join(" · ")}
                    </small>
                  </span>
                  <span className={`admin-kitchen-status admin-kitchen-status--${item.status || "inactive"}`}>
                    {item.status || "inactive"}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="admin-kitchens-message">No kitchens yet. Create your first kitchen.</p>
        )}
      </article>
    </div>
  );
}