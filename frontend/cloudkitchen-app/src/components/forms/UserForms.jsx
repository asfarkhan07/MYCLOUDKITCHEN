import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register, loginUser } from "../../redux/slices/authSlice";
import ThemeToggleButton from "../ThemeToggleButton";
import { showErrorAlert, showSuccessAlert } from "../../utils/sweetAlert.js";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    if (form.username.trim().length < 3) {
      void showErrorAlert("Username must be at least 3 characters long.", "Check your details");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
      void showErrorAlert("Enter a valid email address.", "Check your details");
      return;
    }
    if (form.password.length < 6) {
      void showErrorAlert("Password must be at least 6 characters long.", "Check your details");
      return;
    }

    const result = await dispatch(
      register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }),
    );

    if (register.rejected.match(result)) return;

    await showSuccessAlert("Registration successful. Redirecting to login.", {
      timer: 2000,
    });
    navigate("/Login");
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
        <label className="field-group">
          <span>Username</span>
          <input
            type="text"
            name="username"
            value={form.username}
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
      </form>
    </AuthLayout>
  );
}

export function LoginForm({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
      void showErrorAlert("Enter a valid email address.", "Check your details");
      return;
    }
    if (form.password.length < 6) {
      void showErrorAlert("Password must be at least 6 characters long.", "Check your details");
      return;
    }

    const result = await dispatch(
      loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    );

    if (loginUser.rejected.match(result)) return;

    const role = result?.payload?.user?.role || "user";
    void showSuccessAlert("Login successful. Welcome back.");
    navigate(role === "admin" ? "/admin" : "/dashboard");
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
        <label className="field-group">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
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
