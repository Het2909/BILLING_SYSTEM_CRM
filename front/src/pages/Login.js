import { useState } from "react";
import { LockKeyhole, ReceiptText, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await API.post("token/", formData);

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/");
    } catch (error) {
      setError("Username or password is incorrect.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:flex flex-col justify-between bg-gray-950 px-12 py-10 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-emerald-500 text-gray-950">
              <ReceiptText size={24} strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">Grocery POS</p>
              <p className="text-sm text-gray-400">Billing CRM</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Fast Counter Access
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-tight">
              Sign in and keep the billing counter moving.
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              Manage invoices, inventory, customers, and daily collections from
              one focused workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <p className="text-2xl font-bold">POS</p>
              <p className="mt-1 text-gray-400">Quick billing</p>
            </div>
            <div>
              <p className="text-2xl font-bold">CRM</p>
              <p className="mt-1 text-gray-400">Customer records</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Stock</p>
              <p className="mt-1 text-gray-400">Live inventory</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded bg-gray-950 text-white">
                <ReceiptText size={24} strokeWidth={2.4} />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">Grocery POS</p>
                <p className="text-sm text-gray-500">Billing CRM</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:p-8"
            >
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Welcome Back
                </p>
                <h2 className="mt-3 text-3xl font-bold">Login to dashboard</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your staff credentials to continue.
                </p>
              </div>

              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="mt-2 flex items-center gap-3 rounded border border-gray-300 bg-white px-3 focus-within:border-gray-950 focus-within:ring-2 focus-within:ring-gray-950/10">
                <UserRound className="text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  placeholder="Enter username"
                  className="w-full border-0 py-3 text-base outline-none placeholder:text-gray-400"
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>

              <label className="mt-5 block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-2 flex items-center gap-3 rounded border border-gray-300 bg-white px-3 focus-within:border-gray-950 focus-within:ring-2 focus-within:ring-gray-950/10">
                <LockKeyhole className="text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter password"
                  className="w-full border-0 py-3 text-base outline-none placeholder:text-gray-400"
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 w-full rounded bg-gray-950 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
