import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyUsersOrders } from "../../redux/slices/orderSlice.js";
import UserDashboardNavbar from "./UserDashboardNavbar";

export default function OrdersPage({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyUsersOrders());
  }, [dispatch]);

  return (
    <div className="page-shell dashboard-page">
      <UserDashboardNavbar
        user={{ username: "Roshanara", email: "roshanara@gmail.com", role: "user" }}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div className="dashboard-shell container">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__header">
            <div className="brand-mark">MK</div>
            <div>
              <p className="mini-label dark">Explore</p>
              <h3>User Space</h3>
            </div>
          </div>

          <nav className="dashboard-sidebar__nav" aria-label="User dashboard navigation">
            <Link to="/dashboard" className="dashboard-link">Overview</Link>
            <Link to="/dashboard/kitchens" className="dashboard-link">Kitchens</Link>
            <Link to="/dashboard/cart" className="dashboard-link">Cart</Link>
            <Link
              to="/dashboard/orders"
              className="dashboard-link dashboard-link--active"
              aria-current="page"
            >
              Orders
            </Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <p className="mini-label dark">Your account</p>
              <h1>Orders</h1>
            </div>
          </section>

          <section className="dashboard-panel order-history">
            <div className="dashboard-panel__header">
              <div>
                <p className="mini-label dark">Order history</p>
                <h3>Your orders</h3>
              </div>
            </div>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length ? (
              <div className="order-history__list">
                {orders.map((order) => (
                  <article className="order-history__row" key={order._id}>
                    <div>
                      <strong>{order.kitchen?.name || "Kitchen order"}</strong>
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span className="order-history__items">
                        {order.items?.map((item) =>
                          `${item.menuItem?.name || "Item"} x ${item.quantity}`,
                        ).join(", ") || "Order items unavailable"}
                      </span>
                    </div>
                    <div>
                      <span>{order.orderStatus?.replaceAll("_", " ")}</span>
                      <span>
                        {order.paymentMethod === "razorpay" ? "Online paid" : "Cash on delivery"}
                      </span>
                    </div>
                    <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
                  </article>
                ))}
              </div>
            ) : (
              <p>No orders yet.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}