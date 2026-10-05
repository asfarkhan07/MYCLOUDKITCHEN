import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import KitchenCard from "./KitchenCard";
import { useDispatch,useSelector } from "react-redux";
import { getAllMenuItems, getKitchens } from "../redux/slices/browseSlice";

const liveOrders = [
  { name: "Aarav", status: "On the way", time: "10 mins" },
  { name: "Naina", status: "Preparing", time: "04 mins" },
  { name: "Sam", status: "Ready", time: "02 mins" },
];

function HomePage({ theme, onToggleTheme }) {
  const dispatch=useDispatch();
  const {
    kitchens: kitchenList,
    loading: kitchensLoading,
    menus: menuItems,
    menusLoading,
  } = useSelector((state) => state.browse);

  useEffect(() => {
    dispatch(getKitchens());
  }, [dispatch]);

  useEffect(() => {
    if (kitchenList.length > 0) dispatch(getAllMenuItems(kitchenList));
  }, [dispatch, kitchenList]);

  return (
    <div className="page-shell">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="home-page container">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">MY CLOUD KITCHEN</p>
            <h1>Delicious meals, prepared hot and delivered fast.</h1>
            <p className="hero-text">
              Explore a smart kitchen network serving comfort food, healthy bowls,
              and chef specials with real-time delivery tracking for every order.
            </p>

            <div className="cta-row">
              <Link to="/explore-kitchens" className="btn btn-primary large">
                Explore Kitchen
              </Link>
              <Link to="/Register" className="btn btn-ghost large light hero-link">
                Register
              </Link>
            </div>

            <div className="stats-grid">
              <div>
                <strong>12.4K</strong>
                <span>Orders today</span>
              </div>
              <div>
                <strong>92%</strong>
                <span>On-time delivery</span>
              </div>
              <div>
                <strong>4.8/5</strong>
                <span>Customer rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-panel">
              <div className="panel-header">
                <span className="live-dot" />
                <span>Live delivery</span>
              </div>

              <div className="delivery-summary">
                <div>
                  <small>Active riders</small>
                  <strong>24</strong>
                </div>
                <div>
                  <small>Avg. time</small>
                  <strong>18 min</strong>
                </div>
              </div>

              <div className="order-list">
                {liveOrders.map((order) => (
                  <div className="order-item" key={order.name}>
                    <div className="customer-meta">
                      <span className="avatar">{order.name.slice(0, 1)}</span>
                      <div>
                        <strong>{order.name}</strong>
                        <small>{order.status}</small>
                      </div>
                    </div>
                    <span className="order-time">{order.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="floating-card">
              <span className="mini-label">Today's rush</span>
              <strong>311 orders</strong>
              <small>+18% from yesterday</small>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <div>
            <span>Zero-commission kitchen</span>
          </div>
          <div>
            <span>Smart order routing</span>
          </div>
          <div>
            <span>Real-time tracking</span>
          </div>
          <div>
            <span>Fast repeat orders</span>
          </div>
        </section>

        <section className="kitchen-section">
          <div className="section-heading">
            <div>
              <p className="mini-label dark">Featured kitchens</p>
              <h2>Popular kitchens near you</h2>
            </div>
            <Link to="/explore-kitchens" className="text-link">
              View all kitchens
            </Link>
          </div>

          <div className="kitchen-grid">
            {kitchensLoading ? (
              <p>Loading kitchens...</p>
            ) : kitchenList.length > 0 ? (
              kitchenList.map((kitchen) => (
                <KitchenCard key={kitchen._id} kitchen={kitchen} />
              ))
            ) : (
              <p>No kitchens are available yet.</p>
            )}
          </div>
        </section>

        <section className="menu-section">
          <div className="section-heading">
            <div>
              <p className="mini-label dark">Chef specials</p>
              <h2>Available menu items</h2>
            </div>
          </div>

          <div className="menu-grid">
            {menusLoading ? (
              <p>Loading menu...</p>
            ) : menuItems.length > 0 ? (
              menuItems.map((dish) => (
                <article className="menu-card" key={dish._id}>
                  <div className="menu-badge">{dish.category}</div>
                  <div className="dish-header">
                    <h3>{dish.name}</h3>
                    <span>${Number(dish.price).toFixed(2)}</span>
                  </div>
                  <p>{dish.description}</p>
                  <button type="button" className="menu-button">
                    Add to cart
                  </button>
                </article>
              ))
            ) : (
              <p>No menu items are available yet.</p>
            )}
          </div>
        </section>

        <section className="cta-banner">
          <div>
            <p className="mini-label light">Launch your kitchen</p>
            <h2>Serve your neighborhood with My Cloud Kitchen</h2>
          </div>
          <button type="button" className="btn btn-primary large light-btn">
            Register your kitchen
          </button>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
