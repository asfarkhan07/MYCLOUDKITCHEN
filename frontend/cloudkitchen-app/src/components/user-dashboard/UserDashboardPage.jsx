import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenuItems, getKitchens } from "../../redux/slices/browseSlice";
import { addToCart, selectCartCount, selectCartItems } from "../../redux/slices/cartSlice";
import UserDashboardNavbar from "./UserDashboardNavbar";
import KitchenExplorer from "./KitchenExplorer";
import MenuList from "./MenuList";
import CartSummary from "./CartSummary";
import StatCard from "./StatCard";
import { showSuccessAlert } from "../../utils/sweetAlert.js";

export default function UserDashboardPage({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    kitchens,
    menus,
    loading: kitchensLoading,
    menusLoading,
  } = useSelector((state) => state.browse);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    dispatch(getKitchens());
  }, [dispatch]);

  useEffect(() => {
    if (kitchens.length > 0) dispatch(getAllMenuItems(kitchens));
  }, [dispatch, kitchens]);

  const selectedKitchen = kitchens[0];

  const handleKitchenSelect = (kitchenId) => {
    navigate(`/dashboard/kitchens/${encodeURIComponent(kitchenId)}/menu`);
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    void showSuccessAlert(`${item.name} added to cart.`);
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
            <Link to="/dashboard" className="dashboard-link dashboard-link--active">Overview</Link>
            <Link to="/dashboard/kitchens" className="dashboard-link">Kitchens</Link>
            <Link to="/dashboard/cart" className="dashboard-link">Cart</Link>
            <Link to="/dashboard/orders" className="dashboard-link">Orders</Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <p className="mini-label dark">Customer dashboard</p>
              <h1>Discover the best meals nearby</h1>
              <p className="dashboard-subtitle">
                Browse all kitchen partners, view menus, and add your favorites to cart.
              </p>
            </div>
          </section>

          <section className="stats-grid dashboard-stats">
            <StatCard label="Kitchens" value={String(kitchens.length)} detail="Live partners" accent="green" />
            <StatCard label="Menu items" value={String(menus.length)} detail="Across all kitchens" accent="orange" />
            <StatCard label="Cart items" value={String(cartCount)} detail="Pending checkout" accent="blue" />
            <StatCard label="Delivery" value={selectedKitchen ? `${selectedKitchen.deliveryRadius} km` : "-"} detail="Current radius" accent="purple" />
          </section>

          <section className="dashboard-content-grid user-grid">
            <KitchenExplorer
              kitchens={kitchens}
              loading={kitchensLoading}
              selectedKitchenId=""
              onSelectKitchen={handleKitchenSelect}
            />

            <CartSummary items={cartItems} />
          </section>

          <MenuList
            menuItems={menus}
            kitchens={kitchens}
            loading={menusLoading}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>
    </div>
  );
}
