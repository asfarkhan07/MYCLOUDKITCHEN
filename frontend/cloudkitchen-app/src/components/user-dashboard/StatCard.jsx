export default function StatCard({ label, value, detail, accent = "orange" }) {
  const accentClass = {
    orange: "stat-card--orange",
    green: "stat-card--green",
    blue: "stat-card--blue",
    purple: "stat-card--purple",
  }[accent] || "stat-card--orange";

  return (
    <article className={`stat-card ${accentClass}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      <span className="stat-card__detail">{detail}</span>
    </article>
  );
}
