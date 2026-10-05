import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getKitchens,
  getMenuByKitchen,
} from "../../redux/slices/browseSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import UserDashboardNavbar from "./UserDashboardNavbar";
import MenuList from "./MenuList";
import { showSuccessAlert } from "../../utils/sweetAlert.js";

export default function KitchenMenuPage({ theme, onToggleTheme }) {
  const { kitchenId } = useParams();
  const dispatch = useDispatch();
  const {
    kitchens,
    selectedKitchenMenus,
    selectedKitchenMenuId,
    selectedKitchenMenuLoading,
    selectedKitchenMenuError,
  } = useSelector((state) => state.browse);
  const kitchen = kitchens.find(
    (item) => String(item._id || item.id) === kitchenId,
  );
  const menuMatchesRoute = selectedKitchenMenuId === kitchenId;

  useEffect(() => {
    if (kitchens.length === 0) dispatch(getKitchens());
  }, [dispatch, kitchens.length]);

  useEffect(() => {
    if (kitchenId) dispatch(getMenuByKitchen(kitchenId));
  }, [dispatch, kitchenId]);

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
              <p className="mini-label dark">Kitchen menu</p>
              <h1>{kitchen?.name || "Browse menu"}</h1>
              <p className="dashboard-subtitle">
                {kitchen?.description || "Browse available menu items from this kitchen."}
              </p>
              <Link to="/dashboard/kitchens" className="text-link">
                Back to kitchens
              </Link>
            </div>
          </section>

          <MenuList
            title={`${kitchen?.name || "Kitchen"} menu`}
            menuItems={menuMatchesRoute ? selectedKitchenMenus : []}
            kitchens={kitchens}
            loading={!menuMatchesRoute || selectedKitchenMenuLoading}
            error={menuMatchesRoute ? selectedKitchenMenuError : null}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>
    </div>
  );
}
