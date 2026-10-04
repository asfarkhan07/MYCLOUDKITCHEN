import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

export default function UserProfileMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data=useSelector((state)=>state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const safeUser = {
    username: data.user.role === "admin" ? "Admin User" : "User",
    email: data.user.email,
    role: data.user.role,
  };
  console.log(safeUser);

  const initials = (safeUser.username || "US")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "US";

  const roleLabel = safeUser.role === "admin" ? "Admin" : "User";

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="user-menu">
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="user-menu__avatar">{initials}</span>

        <span className="user-menu__details">
          <strong>{safeUser.username}</strong>
          <small>{safeUser.email}</small>
        </span>

        <span
          className={`nav-role-badge ${roleLabel === "User" ? "nav-role-badge--user" : ""}`}
        >
          {roleLabel}
        </span>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <button type="button" className="user-menu__item" onClick={() => setIsOpen(false)}>
            Update profile
          </button>
          <button type="button" className="user-menu__item" onClick={() => setIsOpen(false)}>
            Settings
          </button>
          <button
            type="button"
            className="user-menu__item user-menu__item--danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
