function TextInput({ className = "", ...props }) {
  return (
    <input
      className={`rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  );
}

export default TextInput;
