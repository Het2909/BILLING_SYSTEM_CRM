function EmptyState({ message = "No records found." }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
      {message}
    </div>
  );
}

export default EmptyState;
