import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getKitchen } from "../../redux/slices/kitchenSlice";
import AdminDashboardNavbar from "./AdminDashboardNavbar";
import { useEffect } from "react";

const hiddenAttributes = new Set(["_id", "owner", "image"]);

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/^\w/, (letter) => letter.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length ? value.map(formatValue).join(", ") : "None";
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${formatLabel(key)}: ${formatValue(nestedValue)}`)
      .join(" · ");
  }

  return String(value);
};

export default function KitchenDetailsPage({ theme, onToggleTheme }) {
  const { kitchenId } = useParams();
  const dispatch = useDispatch();
  const { kitchen, loading } = useSelector((state) => state.kitchen);

  useEffect(() => {
    if (kitchenId) dispatch(getKitchen(kitchenId));
  }, [dispatch, kitchenId]);

  const kitchenMatchesRoute =
    kitchen && String(kitchen._id || kitchen.id) === kitchenId;

  return (
    <div className="page-shell dashboard-page">
      <AdminDashboardNavbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="kitchen-details-page">
        <Link to="/kitchen" className="btn btn-ghost nav-action-link kitchen-details-back">
          ← Back to kitchens
        </Link>

        {kitchenMatchesRoute ? (
          <article className="dashboard-panel kitchen-details" aria-label={`${kitchen.name} details`}>
            <header className="kitchen-details__header">
              <div>
                <p className="mini-label dark">Selected kitchen</p>
                <h4>{kitchen.name}</h4>
              </div>
            </header>

            {kitchen.image?.url && (
              <img className="kitchen-details__image" src={kitchen.image.url} alt={`${kitchen.name} kitchen`} />
            )}

            <dl className="kitchen-details__grid">
              {Object.entries(kitchen)
                .filter(([key]) => !hiddenAttributes.has(key))
                .map(([key, value]) => (
                <div className="kitchen-detail-field" key={key}>
                  <dt>{formatLabel(key)}</dt>
                  <dd>{formatValue(value)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ) : loading ? (
          <p className="kitchen-details-state" role="status">Loading kitchen details...</p>
        ) : (
          null
        )}
      </main>
    </div>
  );
}