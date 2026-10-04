export default function MenuList({
  title = "All available menu items",
  menuItems,
  kitchens,
  loading,
  error,
  onAddToCart,
}) {
  return (
    <article className="dashboard-panel dashboard-panel--wide">
      <div className="dashboard-panel__header">
        <div>
          <p className="mini-label dark">Menu</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="menu-list-grid">
        {loading ? (
          <p>Loading menu...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : menuItems.length > 0 ? (
          menuItems.map((item) => {
            const itemKitchenId = String(
              item.kitchen?._id || item.kitchen?.id || item.kitchen || "",
            );
            const kitchenName = kitchens.find(
              (kitchen) => String(kitchen._id || kitchen.id) === itemKitchenId,
            )?.name;

            return (
              <div className="menu-item-card" key={item._id || item.id}>
                <div className="menu-item-card__top">
                  <span className="mini-label dark">
                    {kitchenName ? `${kitchenName} · ${item.category}` : item.category}
                  </span>
                  <strong>{item.name}</strong>
                </div>

                <p>{item.description}</p>

                <div className="menu-item-card__meta">
                  <span>₹{item.price}</span>
                  <small>{item.preparationTime} mins</small>
                </div>

                <button type="button" className="btn btn-primary small-button" onClick={() => onAddToCart(item)}>
                  Add to cart
                </button>
              </div>
            );
          })
        ) : (
          <p>No menu items are available for this kitchen.</p>
        )}
      </div>
    </article>
  );
}
