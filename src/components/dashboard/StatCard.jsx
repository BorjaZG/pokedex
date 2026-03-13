function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card${accent ? " stat-card--accent" : ""}`}>
      {icon && <span className="stat-card-icon" aria-hidden="true">{icon}</span>}
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  );
}

export default StatCard;
