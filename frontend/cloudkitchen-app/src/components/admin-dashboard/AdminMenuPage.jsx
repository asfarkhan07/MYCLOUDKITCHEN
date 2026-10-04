import { Link } from "react-router-dom";
import AdminDashboardNavbar from "./AdminDashboardNavbar";
import AddMenuForm from "./AddMenuForm.jsx";

export default function AdminMenuPage({ theme, onToggleTheme }) {
  return (
    <div className="page-shell dashboard-page">
      <AdminDashboardNavbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="container admin-menu-page-layout">
        <Link className="btn btn-ghost nav-action-link admin-menu-back" to="/admin">
          ← Back to dashboard
        </Link>
        <section className="dashboard-panel admin-menu-page">
          <div className="dashboard-panel__header">
            <div>
              <p className="mini-label dark">Menu management</p>
              <h3>Add menu item</h3>
            </div>
          </div>
          <AddMenuForm />
        </section>
      </main>
    </div>
  );
}