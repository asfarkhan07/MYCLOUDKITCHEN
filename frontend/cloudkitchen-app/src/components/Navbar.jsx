import { Link } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";

const navItems = ["Home", "Explore Kitchen", "How it works", "Support"];

function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <nav className="navbar container">
        <div className="brand" aria-label="My Cloud Kitchen home">
          <div className="brand-mark">MK</div>
          <span>My Cloud Kitchen</span>
        </div>

        <div className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            item === "Home" ? (
              <Link key={item} to="/" className="nav-item">
                {item}
              </Link>
            ) : item === "Explore Kitchen" ? (
              <Link key={item} to="/explore-kitchens" className="nav-item">
                {item}
              </Link>
            ) : item === "How it works" ? (
              <Link key={item} to="/how-it-works" className="nav-item">
                {item}
              </Link>
            ) : (
              <a key={item} href="#" className="nav-item">
                {item}
              </a>
            )
          ))}
        </div>

        <div className="nav-actions">
          <Link to="/Register" className="btn btn-ghost nav-action-link">
            Register
          </Link>
          <Link to="/Login" className="btn btn-primary nav-action-link">
            Login
          </Link>
          <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
