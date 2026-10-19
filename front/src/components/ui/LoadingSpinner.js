function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-8 text-gray-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
