function KitchenCard({ kitchen }) {
  return (
    <article className="kitchen-card">
      <div className="kitchen-image">
        {kitchen.image?.url && (
          <img src={kitchen.image.url} alt={`${kitchen.name} kitchen`} loading="lazy" />
        )}
        <div className="rating-pill">★ {Number(kitchen.averageRating || 0).toFixed(1)}</div>
      </div>

      <div className="kitchen-card-body">
        <div className="kitchen-title-row">
          <div>
            <h3>{kitchen.name}</h3>
            <p>{kitchen.cuisineType?.join(", ") || kitchen.description}</p>
          </div>
          <span className="delivery-time">
            {kitchen.address?.city || `${kitchen.deliveryRadius} km`}
          </span>
        </div>

        <div className="menu-preview">
          {(kitchen.cuisineType || []).map((cuisine) => (
            <span key={cuisine}>{cuisine}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default KitchenCard;
