import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getKitchens } from "../../redux/slices/browseSlice";
import UserDashboardNavbar from "./UserDashboardNavbar";
import KitchenExplorer from "./KitchenExplorer";

export default function KitchensPage({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    kitchens,
    loading,
    error,
  } = useSelector((state) => state.browse);

  useEffect(() => {
    dispatch(getKitchens());
  }, [dispatch]);

  const handleKitchenSelect = (kitchenId) => {
    navigate(`/dashboard/kitchens/${encodeURIComponent(kitchenId)}/menu`);
  };

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
            <Link
              to="/dashboard/kitchens"
              className="dashboard-link dashboard-link--active"
              aria-current="page"
            >
              Kitchens
            </Link>
            <Link to="/dashboard/cart" className="dashboard-link">Cart</Link>
            <Link to="/dashboard/orders" className="dashboard-link">Orders</Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <p className="mini-label dark">Browse kitchens</p>
              <h1>Explore available kitchens</h1>
              <p className="dashboard-subtitle">
                Browse every active kitchen partner.
              </p>
            </div>
          </section>

          <KitchenExplorer
            kitchens={kitchens}
            loading={loading}
            error={error}
            selectedKitchenId=""
            onSelectKitchen={handleKitchenSelect}
          />
        </main>
      </div>
    </div>
  );
}
