const variants = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
  info: "bg-blue-500 text-white hover:bg-blue-600",
};

function Button({
  children,
  className = "",
  disabled = false,
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:bg-gray-400 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
