export default function KitchenExplorer({
  kitchens,
  loading,
  error,
  selectedKitchenId,
  onSelectKitchen,
}) {
  return (
    <article className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="mini-label dark">Kitchen</p>
          <h3>Available kitchens</h3>
        </div>
      </div>

      <div className="kitchen-card-stack">
        {loading ? (
          <p>Loading kitchens...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : kitchens.length > 0 ? (
          kitchens.map((kitchen) => {
            const kitchenId = String(kitchen._id || kitchen.id);

            return (
              <button
                key={kitchenId}
                type="button"
                className={`kitchen-card ${selectedKitchenId === kitchenId ? "kitchen-card--active" : ""}`}
                onClick={() => onSelectKitchen(kitchenId)}
              >
                <div>
                  <strong>{kitchen.name}</strong>
                  <small>{kitchen.cuisineType?.join(", ") || kitchen.description}</small>
                </div>
                <span>{kitchen.deliveryRadius} km</span>
              </button>
            );
          })
        ) : (
          <p>No kitchens are available yet.</p>
        )}
      </div>
    </article>
  );
}
