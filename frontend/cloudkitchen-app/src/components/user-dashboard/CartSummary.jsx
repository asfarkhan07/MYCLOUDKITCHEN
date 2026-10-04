export default function CartSummary({ items }) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0,
  );

  return (
    <article className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="mini-label dark">Cart</p>
          <h3>Items in your cart</h3>
        </div>
      </div>

      <div className="cart-summary">
        {items.length ? (
          <>
            {items.map((item, index) => (
              <div className="cart-row" key={`${item._id || item.id}-${index}`}>
                <span>{item.name} × {item.quantity || 1}</span>
                <strong>₹{Number(item.price) * (item.quantity || 1)}</strong>
              </div>
            ))}
            <div className="cart-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>
          </>
        ) : (
          <div className="empty-state">Your cart is empty.</div>
        )}
      </div>
    </article>
  );
}
