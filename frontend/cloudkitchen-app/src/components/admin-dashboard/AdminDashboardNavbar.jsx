import ThemeToggleButton from "../ThemeToggleButton";
import UserProfileMenu from "../UserProfileMenu";

export default function AdminDashboardNavbar({ theme, onToggleTheme }) {
  return (
    <header className="dashboard-topbar admin-dashboard-topbar">
      <div className="dashboard-topbar__inner container">
        <div className="brand" aria-label="Cloud Kitchen admin dashboard">
          <div className="brand-mark">MK</div>
          <span>My Cloud Kitchen</span>
        </div>

        <div className="dashboard-topbar__actions">
          <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
          <UserProfileMenu/>
        </div>
      </div>
    </header>
  );
}
