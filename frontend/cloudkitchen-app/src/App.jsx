import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import ExploreKitchenPage from "./components/ExploreKitchenPage";
import HowItWorksPage from "./components/HowItWorksPage";
import { RegisterForm, LoginForm } from "./components/forms/UserForms";
import UserDashboardPage from "./components/user-dashboard/UserDashboardPage";
import KitchensPage from "./components/user-dashboard/KitchensPage";
import KitchenMenuPage from "./components/user-dashboard/KitchenMenuPage";
import CartPage from "./components/user-dashboard/CartPage";
import OrdersPage from "./components/user-dashboard/OrdersPage";
import AdminDashboardPage from "./components/admin-dashboard/AdminDashboardPage";
import AdminOrdersPage from "./components/admin-dashboard/AdminOrdersPage";
import AdminMenuPage from "./components/admin-dashboard/AdminMenuPage.jsx";
import AdminDashboardNavbar from "./components/admin-dashboard/AdminDashboardNavbar";
import KitchenManagerPanel from "./components/admin-dashboard/KitchenManagerPanel";
import KitchenDetailsPage from "./components/admin-dashboard/KitchenDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function AdminAccessGate({ theme, onToggleTheme }) {
  const user = useSelector((state) => state.auth?.user);

  if (user?.role === "admin") {
    return <AdminDashboardPage theme={theme} onToggleTheme={onToggleTheme} />;
  }

  return <UserDashboardPage theme={theme} onToggleTheme={onToggleTheme} />;
}

function AdminOrdersAccessGate({ theme, onToggleTheme }) {
  const user = useSelector((state) => state.auth?.user);

  if (user?.role === "admin") {
    return <AdminOrdersPage theme={theme} onToggleTheme={onToggleTheme} />;
  }

  return <UserDashboardPage theme={theme} onToggleTheme={onToggleTheme} />;
}

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/explore-kitchens"
          element={<ExploreKitchenPage theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/how-it-works"
          element={<HowItWorksPage theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/Register"
          element={<RegisterForm theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/Login"
          element={<LoginForm theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <UserDashboardPage theme={theme} onToggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/dashboard/kitchens"
            element={<KitchensPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route
            path="/dashboard/kitchens/:kitchenId/menu"
            element={<KitchenMenuPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route
            path="/dashboard/cart"
            element={<CartPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route
            path="/dashboard/orders"
            element={<OrdersPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route
            path="/admin"
            element={
              <AdminAccessGate theme={theme} onToggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminOrdersAccessGate theme={theme} onToggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/admin/menu"
            element={<AdminMenuPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route
            path="/kitchen"
            element={
              <div className="page-shell dashboard-page">
                <AdminDashboardNavbar theme={theme} onToggleTheme={toggleTheme} />
                <main className="kitchen-page-main">
                  <KitchenManagerPanel showStandaloneHeader />
                </main>
              </div>
            }
          />
          <Route
            path="/kitchen/:kitchenId"
            element={<KitchenDetailsPage theme={theme} onToggleTheme={toggleTheme} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
