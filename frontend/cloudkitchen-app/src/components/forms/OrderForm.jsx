export function OrderForm() {
  const paymentMethods = [
    "credit_card",
    "debit_card",
    "upi",
    "net_banking",
    "cash_on_delivery",
  ];

  const paymentStatuses = ["pending", "completed", "failed", "refunded"];
  const orderStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready_for_delivery",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  return (
    <form className="form-card">
      <div className="form-header">
        <p className="mini-label dark">Orders</p>
        <h3>Place Order</h3>
      </div>

      <label className="field-group">
        <span>Customer ID</span>
        <input type="text" name="customer" placeholder="User ObjectId" />
      </label>

      <label className="field-group">
        <span>Kitchen ID</span>
        <input type="text" name="kitchen" placeholder="Kitchen ObjectId" />
      </label>

      <div className="nested-group">
        <h4>Order Items</h4>

        <label className="field-group">
          <span>Menu Item</span>
          <select name="menuItem">
            <option value="">Select menu item</option>
            <option value="paneer_biryani">Paneer Biryani</option>
            <option value="burger">Classic Burger</option>
            <option value="noodles">Spicy Noodles</option>
          </select>
        </label>

        <div className="inline-grid">
          <label className="field-group">
            <span>Quantity</span>
            <input type="number" name="quantity" min="1" placeholder="1" />
          </label>

          <label className="field-group">
            <span>Price</span>
            <input type="number" name="price" step="0.01" min="0" placeholder="0.00" />
          </label>
        </div>

        <label className="field-group">
          <span>Special Instructions</span>
          <textarea name="specialInstructions" rows="2" placeholder="Extra notes" />
        </label>
      </div>

      <div className="inline-grid">
        <label className="field-group">
          <span>Subtotal</span>
          <input type="number" name="subtotal" step="0.01" min="0" placeholder="0.00" />
        </label>

        <label className="field-group">
          <span>Delivery Charge</span>
          <input type="number" name="deliveryCharge" step="0.01" min="0" placeholder="0.00" />
        </label>
      </div>

      <div className="inline-grid">
        <label className="field-group">
          <span>Tax</span>
          <input type="number" name="tax" step="0.01" min="0" placeholder="0.00" />
        </label>

        <label className="field-group">
          <span>Discount</span>
          <input type="number" name="discount" step="0.01" min="0" placeholder="0.00" />
        </label>
      </div>

      <label className="field-group">
        <span>Total Amount</span>
        <input type="number" name="totalAmount" step="0.01" min="0" placeholder="0.00" />
      </label>

      <div className="nested-group">
        <h4>Delivery Address</h4>

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
          <span>Phone Number</span>
          <input type="tel" name="phoneNumber" placeholder="9876543210" />
        </label>
      </div>

      <label className="field-group">
        <span>Payment Method</span>
        <select name="paymentMethod" defaultValue="upi">
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="field-group">
        <span>Payment Status</span>
        <select name="paymentStatus" defaultValue="pending">
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="field-group">
        <span>Order Status</span>
        <select name="orderStatus" defaultValue="pending">
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="field-group">
        <span>Estimated Delivery Time</span>
        <input type="datetime-local" name="estimatedDeliveryTime" />
      </label>

      <label className="field-group">
        <span>Delivery Partner</span>
        <input type="text" name="deliveryPartner" placeholder="Delivery partner user ID" />
      </label>

      <label className="field-group">
        <span>Notes</span>
        <textarea name="notes" rows="3" placeholder="Additional order notes" />
      </label>

      <label className="field-group">
        <span>Rating</span>
        <select name="rating" defaultValue="">
          <option value="">Select rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>

      <label className="field-group">
        <span>Review</span>
        <textarea name="review" rows="2" placeholder="Customer review" />
      </label>

      <label className="field-group">
        <span>Cancellation Reason</span>
        <textarea name="cancellationReason" rows="2" placeholder="Reason for cancellation" />
      </label>

      <button type="button" className="btn btn-primary">Place Order</button>
    </form>
  );
}
