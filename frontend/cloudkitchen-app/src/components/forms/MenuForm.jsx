export function MenuForm() {
  return (
    <form className="form-card">
      <div className="form-header">
        <p className="mini-label dark">Menu</p>
        <h3>Add Menu Item</h3>
      </div>

      <label className="field-group">
        <span>Name</span>
        <input type="text" name="name" placeholder="Menu item name" />
      </label>

      <label className="field-group">
        <span>Description</span>
        <textarea name="description" rows="3" placeholder="Describe the item" />
      </label>

      <label className="field-group">
        <span>Category</span>
        <select name="category" defaultValue="breakfast">
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
          <option value="beverages">Beverages</option>
          <option value="desserts">Desserts</option>
        </select>
      </label>

      <label className="field-group">
        <span>Price</span>
        <input type="number" name="price" placeholder="0.00" step="0.01" min="0" />
      </label>

      <label className="field-group">
        <span>Image URL</span>
        <input type="url" name="image" placeholder="https://image.url" />
      </label>

      <label className="field-group">
        <span>Availability</span>
        <select name="availability" defaultValue="true">
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </label>

      <label className="field-group">
        <span>Vegetarian</span>
        <select name="vegetarian" defaultValue="false">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <label className="field-group">
        <span>Ingredients</span>
        <select name="ingredients" multiple size="5">
          <option value="tomato">Tomato</option>
          <option value="onion">Onion</option>
          <option value="paneer">Paneer</option>
          <option value="rice">Rice</option>
          <option value="garlic">Garlic</option>
          <option value="cheese">Cheese</option>
        </select>
      </label>

      <label className="field-group">
        <span>Preparation Time (minutes)</span>
        <input type="number" name="preparationTime" placeholder="20" min="1" />
      </label>

      <label className="field-group">
        <span>Average Rating</span>
        <input type="number" name="averageRating" placeholder="0" min="0" max="5" step="0.1" />
      </label>

      <button type="button" className="btn btn-primary">Add Item</button>
    </form>
  );
}
