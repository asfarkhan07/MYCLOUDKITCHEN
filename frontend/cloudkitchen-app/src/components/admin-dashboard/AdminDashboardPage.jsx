import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboardNavbar from "./AdminDashboardNavbar";
import KitchenManagerPanel from "./KitchenManagerPanel";
import MenuManagerPanel from "./MenuManagerPanel";
import StatCard from "../user-dashboard/StatCard";
import { fetchMenuForOwner } from "../../redux/slices/menuSlice.js";
import { getMyAdminOrders } from "../../redux/slices/orderSlice.js";

export default function AdminDashboardPage({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const { kitchens = [] } = useSelector((state) => state.kitchen);
  const { menuItems = [], loading: menuLoading, error: menuError } = useSelector(
    (state) => state.menu,
  );
  const { orders = [] } = useSelector((state) => state.orders);
  const kitchen = kitchens[0];

  useEffect(() => {
    dispatch(getMyAdminOrders());
  }, [dispatch]);

  useEffect(() => {
    kitchens.forEach((ownedKitchen) => {
      const kitchenId = String(ownedKitchen._id || ownedKitchen.id || "");
      if (kitchenId) dispatch(fetchMenuForOwner(kitchenId));
    });
  }, [dispatch, kitchens]);

  return (
    <div className="page-shell dashboard-page">
      <AdminDashboardNavbar
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div className="dashboard-shell container">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__header">
            <div className="brand-mark">MK</div>
            <div>
              <p className="mini-label dark">Workspace</p>
              <h3>Admin Ops</h3>
            </div>
          </div>

          <nav
            className="dashboard-sidebar__nav"
            aria-label="Admin dashboard navigation"
          >
            <Link to="/admin" className="dashboard-link dashboard-link--active">
              Overview
            </Link>
            <Link to="/kitchen" className="dashboard-link">
              Kitchen
            </Link>
            <Link to="/admin/menu" className="dashboard-link">
              Menu
            </Link>
            <Link to="/admin/orders" className="dashboard-link">
              Orders
            </Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero admin-hero">
            <div>
              <p className="mini-label dark">Admin controls</p>
              <h1>Kitchen management</h1>
              <p className="dashboard-subtitle">
                Create your kitchen, manage menu items, and track orders placed
                by customers.
              </p>
            </div>
          </section>

          <section className="stats-grid dashboard-stats">
            <StatCard
              label="Kitchen status"
              value={kitchen?.status === "active" ? "Open" : "Closed"}
              detail="Current state"
              accent="green"
            />
            <StatCard
              label="Kitchen count"
              value={String(kitchens.length)}
              detail="Your kitchens"
              accent="orange"
            />
            <StatCard
              label="Menu items"
              value={String(menuItems.length)}
              detail="Available today"
              accent="blue"
            />
            <StatCard
              label="Orders"
              value={String(orders.length)}
              detail="New requests"
              accent="purple"
            />
          </section>

          <section className="dashboard-content-grid admin-grid">
            <KitchenManagerPanel showCreateForm={false} />
            <MenuManagerPanel
              menuItems={menuItems}
              kitchens={kitchens}
              loading={menuLoading}
              error={menuError}
              showAddForm={false}
            />
          </section>

        </main>
      </div>
    </div>
  );
}
