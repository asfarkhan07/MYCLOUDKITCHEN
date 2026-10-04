import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError, loginUser } from "../../redux/slices/authSlice";
import ThemeToggleButton from "../ThemeToggleButton";

function AuthLayout({
  title,
  subtitle,
  children,
  helperText,
  helperLink,
  helperTarget,
  theme,
  onToggleTheme,
}) {
  return (
    <div className="auth-page">
      <div className="auth-toolbar">
        <Link to="/" className="auth-back-btn" aria-label="Back to home page" title="Back to home page">
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </Link>
        <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
      </div>

      <div className="auth-card">
        <div className="auth-brand" aria-label="My Cloud Kitchen home">
          <div className="brand-mark">MK</div>
          <span>My Cloud Kitchen</span>
        </div>

        <div className="auth-header">
          <p className="mini-label">Authentication</p>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>

        {children}

        {helperText && (
          <p className="auth-footer">
            {helperText} <Link to={helperTarget}>{helperLink}</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export function RegisterForm({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth?.error);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
    if (alert.message) {
      setAlert({ type: "", message: "" });
    }
  };

  const dismissError = () => {
    setAlert({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, general: "" }));
    dispatch(clearError());
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    try {
      const result = await dispatch(
        register({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      );

      if (register.rejected.match(result)) {
        throw new Error(
          result.payload || result.error?.message || "Registration failed.",
        );
      }

      setErrors({});
      dispatch(clearError());
      setAlert({
        type: "success",
        message: "Registration successful. Log in to continue.",
      });
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Registration failed. Please try again.";

      setAlert({ type: "error", message });
      setErrors({
        general: message,
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
        setErrors({});
        dispatch(clearError());
      }, 5000);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your kitchen account and start exploring fresh meals."
      helperText="Already have an account?"
      helperLink="Login"
      helperTarget="/Login"
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
      <form className="auth-form" onSubmit={registerSubmit} noValidate>
        {alert.message && (
          <div
            className={`form-alert ${
              alert.type === "success"
                ? "form-alert-success"
                : "form-alert-error"
            }`}
            role="alert"
          >
            <span className="form-alert-icon" aria-hidden="true">
              {alert.type === "success" ? "✓" : "!"}
            </span>
            <span>{alert.message}</span>
            <button
              type="button"
              className="form-alert-close"
              aria-label="Dismiss notification"
              onClick={() => dismissError()}
            >
              ×
            </button>
          </div>
        )}

        {!alert.message && (authError || errors.general) && (
          <div className="form-alert form-alert-error" role="alert">
            <span className="form-alert-icon" aria-hidden="true">
              !
            </span>
            <span>{authError || errors.general}</span>
            <button
              type="button"
              className="form-alert-close"
              aria-label="Dismiss notification"
              onClick={() => {
                setErrors((prev) => ({ ...prev, general: "" }));
                dispatch(clearError());
              }}
            >
              ×
            </button>
          </div>
        )}
        <label className="field-group">
          <span>Username</span>
          <input
            type="text"
            name="username"
            value={form.username}
            error={errors.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </label>

        <label className="field-group">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            error={errors.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </label>

        <label className="field-group">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            error={errors.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </label>

        <label className="field-group">
          <span>Role</span>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </label>

        <button type="submit" className="btn btn-primary auth-submit">
          Create Account
        </button>
        {alert.type === "success" && (
          <Link to="/Login" className="btn btn-ghost auth-submit">
            Continue to login
          </Link>
        )}
      </form>
    </AuthLayout>
  );
}

export function LoginForm({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth?.error);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
    if (authError) {
      dispatch(clearError());
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(clearError());

    try {
      const result = await dispatch(
        loginUser({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      );

      if (loginUser.rejected.match(result)) {
        throw new Error(
          result.payload || result.error?.message || "Login failed.",
        );
      }

      const role = result?.payload?.user?.role || "user";
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Login failed. Please try again.";
      setErrors({ general: message });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your meals and orders."
      helperText="Need an account?"
      helperLink="Register"
      helperTarget="/Register"
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
      <form className="auth-form" onSubmit={loginSubmit} noValidate>
        {(authError || errors.general) && (
          <div className="form-alert form-alert-error" role="alert">
            <span className="form-alert-icon" aria-hidden="true">
              !
            </span>
            <span>{authError || errors.general}</span>
            <button
              type="button"
              className="form-alert-close"
              aria-label="Dismiss notification"
              onClick={() => {
                setErrors((prev) => ({ ...prev, general: "" }));
                dispatch(clearError());
              }}
            >
              ×
            </button>
          </div>
        )}

        <label className="field-group">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            error={errors.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </label>

        <label className="field-group">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            error={errors.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </label>

        <button type="submit" className="btn btn-primary auth-submit">
          Login
        </button>
      </form>
    </AuthLayout>
  );
}

export function UpdateProfileForm() {
  return (
    <form className="form-card auth-form-card">
      <div className="form-header">
        <p className="mini-label dark">User</p>
        <h3>Update Profile</h3>
      </div>

      <label className="field-group">
        <span>Username</span>
        <input type="text" name="username" placeholder="Update username" />
      </label>

      <label className="field-group">
        <span>Email</span>
        <input type="email" name="email" placeholder="Update email" />
      </label>

      <label className="field-group">
        <span>Avatar URL</span>
        <input
          type="url"
          name="avatarUrl"
          placeholder="https://example.com/avatar.jpg"
        />
      </label>

      <label className="field-group">
        <span>Role</span>
        <select name="role" defaultValue="user">
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </label>

      <button type="button" className="btn btn-secondary">
        Save Changes
      </button>
    </form>
  );
}
