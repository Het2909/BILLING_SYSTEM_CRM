function Alert({ children, type = "error" }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </p>
  );
}

export default Alert;
