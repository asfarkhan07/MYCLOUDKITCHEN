import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const adminSteps = [
  {
    title: "Create an admin account",
    description:
      "Register and choose Admin as your account role, then sign in to open the management dashboard.",
  },
  {
    title: "Set up your kitchen",
    description:
      "Add your kitchen name, location, cuisine, delivery area, and contact details. Set its status to Open when it is ready to take orders.",
  },
  {
    title: "Build your menu",
    description:
      "Add dishes with names, descriptions, prices, and availability. Keep availability up to date so customers see what they can order.",
  },
  {
    title: "Manage incoming orders",
    description:
      "Review customer orders in Admin Dashboard > Orders and see which kitchen each order came from.",
  },
];

const customerSteps = [
  {
    title: "Find a kitchen",
    description:
      "Explore open kitchens and browse their available dishes. Your cart is kept to one kitchen at a time.",
  },
  {
    title: "Choose your dishes",
    description:
      "Add dishes and quantities to your cart, check the total, and enter the address and phone number for delivery.",
  },
  {
    title: "Pick how to pay",
    description:
      "Choose cash on delivery or pay online through Razorpay. Online orders are saved after payment is verified; cash-on-delivery orders are saved when placed.",
  },
  {
    title: "Follow your order",
    description:
      "Find your order in Dashboard > Orders and check its current status, payment method, items, and total.",
  },
];

function Workflow({ label, title, steps, action, to }) {
  return (
    <section className="how-flow">
      <header className="how-flow__header">
        <p className="mini-label dark">{label}</p>
        <h2>{title}</h2>
      </header>
      <ol className="how-step-list">
        {steps.map((step, index) => (
          <li className="how-step" key={step.title}>
            <span className="how-step__number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link to={to} className="text-link">{action}</Link>
    </section>
  );
}

export default function HowItWorksPage({ theme, onToggleTheme }) {
  return (
    <div className="page-shell">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="how-page container">
        <section className="how-intro">
          <div className="how-intro__copy">
            <p className="mini-label dark">HOW IT WORKS</p>
            <h1>Good food starts with a kitchen. It ends at your table.</h1>
            <p>
              My Cloud Kitchen connects independent kitchens with customers:
              admins set up kitchens and menus, and customers discover dishes,
              place orders, and follow progress from one dashboard.
            </p>
            <div className="cta-row">
              <Link to="/explore-kitchens" className="btn btn-primary large">
                Explore kitchens
              </Link>
              <Link to="/Register" className="btn btn-ghost large">
                Create an account
              </Link>
            </div>
          </div>
          <aside className="how-intro__aside">
            <span>ONE PLATFORM</span>
            <strong>Two ways to get started</strong>
            <p>Set up a kitchen and start selling, or find something delicious nearby.</p>
          </aside>
        </section>

        <div className="how-flow-grid">
          <Workflow
            label="FOR KITCHEN ADMINS"
            title="Bring your kitchen online"
            steps={adminSteps}
            action="Register as an admin"
            to="/Register"
          />
          <Workflow
            label="FOR CUSTOMERS"
            title="Order something delicious"
            steps={customerSteps}
            action="Browse open kitchens"
            to="/explore-kitchens"
          />
        </div>
      </main>
    </div>
  );
}