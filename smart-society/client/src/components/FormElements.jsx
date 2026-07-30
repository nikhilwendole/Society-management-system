export const Input = ({ label, ...props }) => (
  <label className="mb-3 block text-sm">
    {label && <span className="mb-1 block font-medium text-ink/70">{label}</span>}
    <input
      {...props}
      className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink outline-none transition-colors focus:border-primary"
    />
  </label>
);

export const Textarea = ({ label, ...props }) => (
  <label className="mb-3 block text-sm">
    {label && <span className="mb-1 block font-medium text-ink/70">{label}</span>}
    <textarea
      {...props}
      className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink outline-none transition-colors focus:border-primary"
    />
  </label>
);

export const Select = ({ label, options, ...props }) => (
  <label className="mb-3 block text-sm">
    {label && <span className="mb-1 block font-medium text-ink/70">{label}</span>}
    <select
      {...props}
      className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink outline-none transition-colors focus:border-primary"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light",
    outline: "border border-border text-ink hover:bg-surface",
    danger: "bg-danger text-white hover:opacity-90",
  };

  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
