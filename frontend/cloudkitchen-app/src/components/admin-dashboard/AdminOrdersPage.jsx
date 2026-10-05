import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyAdminOrders } from "../../redux/slices/orderSlice.js";
import AdminDashboardNavbar from "./AdminDashboardNavbar";
import OrderListPanel from "./OrderListPanel";

export default function AdminOrdersPage({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const adminId = useSelector((state) => state.auth.user?.id || state.auth.user?._id);
  const orders = useSelector(
    (state) => state.orders.adminOrdersByAdminId[adminId] || [],
  );
  const loading = useSelector(
    (state) => state.orders.adminOrdersLoadingByAdminId[adminId] || false,
  );

  useEffect(() => {
    if (adminId) dispatch(getMyAdminOrders(adminId));
  }, [dispatch, adminId]);

  return (
    <div className="page-shell dashboard-page">
      <AdminDashboardNavbar theme={theme} onToggleTheme={onToggleTheme} />

      <div className="dashboard-shell container">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__header">
            <div className="brand-mark">MK</div>
            <div>
              <p className="mini-label dark">Workspace</p>
              <h3>Admin Ops</h3>
            </div>
          </div>

          <nav className="dashboard-sidebar__nav" aria-label="Admin dashboard navigation">
            <Link to="/admin" className="dashboard-link">Overview</Link>
            <Link to="/kitchen" className="dashboard-link">Kitchen</Link>
            <Link to="/admin/menu" className="dashboard-link">Menu</Link>
            <Link
              to="/admin/orders"
              className="dashboard-link dashboard-link--active"
              aria-current="page"
            >
              Orders
            </Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero admin-hero">
            <div>
              <p className="mini-label dark">Admin controls</p>
              <h1>Customer orders</h1>
              <p className="dashboard-subtitle">
                Review order details, status, and the kitchen preparing each order.
              </p>
            </div>
          </section>

          <OrderListPanel orders={orders} loading={loading} />
        </main>
      </div>
    </div>
  );
}