export default function OrderListPanel({ orders, loading }) {
  return (
    <article className="dashboard-panel dashboard-panel--wide">
      <div className="dashboard-panel__header">
        <div>
          <p className="mini-label dark">Orders</p>
          <h3>Placed by customers</h3>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length ? (
        <div className="order-stack">
          {orders.map((order) => (
            <div className="order-item-card" key={order._id}>
              <div>
                <strong>
                  {order.customer?.username || order.customer?.email || "Customer"}
                </strong>
                <small>Kitchen: {order.kitchen?.name || "Kitchen unavailable"}</small>
                <small>
                  {order.items?.map((item) =>
                    `${item.menuItem?.name || item.name || "Menu item"} x ${item.quantity}`,
                  ).join(", ") || "No items"}
                </small>
              </div>

              <div>
                <small>{new Date(order.createdAt).toLocaleString()}</small>
                <span className="status-tag">
                  {order.orderStatus?.replaceAll("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No customer orders yet.</p>
      )}
    </article>
  );
}
