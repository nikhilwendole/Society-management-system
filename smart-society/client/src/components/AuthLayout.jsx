const AuthLayout = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen items-center justify-center bg-primary px-4">
    <div className="w-full max-w-md rounded-lg bg-panel p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-primary">Smart Society</h1>
        <p className="mt-2 text-lg font-medium text-ink">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

export default AuthLayout;
