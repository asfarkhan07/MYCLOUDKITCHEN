export function KitchenForm() {
  return (
    <form className="form-card">
      <div className="form-header">
        <p className="mini-label dark">Kitchen</p>
        <h3>Create Kitchen</h3>
      </div>

      <label className="field-group">
        <span>Kitchen Name</span>
        <input type="text" name="name" placeholder="Kitchen name" />
      </label>

      <label className="field-group">
        <span>Owner ID</span>
        <input type="text" name="owner" placeholder="User ObjectId" />
      </label>

      <label className="field-group">
        <span>Description</span>
        <textarea name="description" rows="3" placeholder="Describe the kitchen" />
      </label>

      <label className="field-group">
        <span>Cuisine Type</span>
        <select name="cuisineType" multiple size="4">
          <option value="indian">Indian</option>
          <option value="chinese">Chinese</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="healthy">Healthy</option>
        </select>
      </label>

      <div className="nested-group">
        <h4>Address</h4>

        <label className="field-group">
          <span>Street</span>
          <input type="text" name="street" placeholder="Street address" />
        </label>

        <label className="field-group">
          <span>City</span>
          <input type="text" name="city" placeholder="City" />
        </label>

        <label className="field-group">
          <span>State</span>
          <input type="text" name="state" placeholder="State" />
        </label>

        <label className="field-group">
          <span>Zip Code</span>
          <input type="text" name="zipCode" placeholder="Zip code" />
        </label>

        <label className="field-group">
          <span>Country</span>
          <input type="text" name="country" placeholder="Country" />
        </label>
      </div>

      <div className="inline-grid">
        <label className="field-group">
          <span>Latitude</span>
          <input type="number" name="latitude" step="any" placeholder="0.00" />
        </label>

        <label className="field-group">
          <span>Longitude</span>
          <input type="number" name="longitude" step="any" placeholder="0.00" />
        </label>
      </div>

      <label className="field-group">
        <span>Contact Number</span>
        <input type="tel" name="contactNumber" placeholder="+91 98765 43210" />
      </label>

      <label className="field-group">
        <span>Image URL</span>
        <input type="url" name="image" placeholder="https://image.url" />
      </label>

      <label className="field-group">
        <span>Delivery Radius (km)</span>
        <input type="number" name="deliveryRadius" placeholder="5" min="0" />
      </label>

      <label className="field-group">
        <span>Status</span>
        <select name="status" defaultValue="active">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="closed">Closed</option>
        </select>
      </label>

      <label className="field-group">
        <span>Verified</span>
        <select name="verified" defaultValue="false">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <button type="button" className="btn btn-primary">Save Kitchen</button>
    </form>
  );
}
