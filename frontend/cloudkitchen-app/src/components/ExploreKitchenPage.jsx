import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getKitchens } from "../redux/slices/browseSlice.js";
import Navbar from "./Navbar";
import KitchenCard from "./KitchenCard";

export default function ExploreKitchenPage({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const { kitchens, loading } = useSelector((state) => state.browse);

  useEffect(() => {
    dispatch(getKitchens());
  }, [dispatch]);

  return (
    <div className="page-shell">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="home-page container">
        <section className="dashboard-hero">
          <div>
            <p className="mini-label dark">Browse kitchens</p>
            <h1>Explore kitchens</h1>
            <p className="dashboard-subtitle">
              Discover every kitchen currently available.
            </p>
          </div>
        </section>

        <section className="kitchen-section">
          <div className="section-heading">
            <div>
              <p className="mini-label dark">All kitchens</p>
              <h2>{loading ? "Loading kitchens" : `${kitchens.length} kitchens`}</h2>
            </div>
            <Link to="/" className="text-link">Back to home</Link>
          </div>

          <div className="kitchen-grid">
            {loading ? (
              <p>Loading kitchens...</p>
            ) : kitchens.length ? (
              kitchens.map((kitchen) => (
                <KitchenCard key={kitchen._id || kitchen.id} kitchen={kitchen} />
              ))
            ) : (
              <p>No kitchens are available yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}