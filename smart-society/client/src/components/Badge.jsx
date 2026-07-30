const STYLES = {
  Pending: "bg-warning/10 text-warning",
  "In Progress": "bg-primary/10 text-primary",
  Resolved: "bg-success/10 text-success",
  Paid: "bg-success/10 text-success",
  Approved: "bg-success/10 text-success",
  Rejected: "bg-danger/10 text-danger",
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-danger/10 text-danger",
};

const Badge = ({ value }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STYLES[value] || "bg-ink/10 text-ink/60"}`}>
    {value}
  </span>
);

export default Badge;
