const Card = ({ title, value, icon: Icon, accent = "primary" }) => {
  const accentClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    danger: "bg-danger/10 text-danger",
    success: "bg-success/10 text-success",
  };

  return (
    <div className="rounded-lg border border-border bg-panel p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink/50">{title}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-md p-3 ${accentClasses[accent]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
