import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../redux/slices/cartSlice";
import ThemeToggleButton from "../ThemeToggleButton";
import UserProfileMenu from "../UserProfileMenu";

export default function UserDashboardNavbar({ user, theme, onToggleTheme }) {
  const cartCount = useSelector(selectCartCount);

  return (
    <header className="dashboard-topbar user-dashboard-topbar">
      <div className="dashboard-topbar__inner container">
        <div className="brand" aria-label="Cloud Kitchen user dashboard">
          <div className="brand-mark">MK</div>
          <span>My Cloud Kitchen</span>
        </div>

        <div className="dashboard-topbar__actions">
          <Link to="/dashboard/cart" className="btn btn-ghost cart-button" aria-label="Open cart">
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
          <UserProfileMenu user={user} variant={user?.role || "user"} />
        </div>
      </div>
    </header>
  );
}
