import { useState } from "react";
import { Building2, Mail, MapPin, Phone, ReceiptText, UserRound } from "lucide-react";

import { getApiErrorMessage } from "../services/errorService";
import { createSupplier } from "../services/supplierService";

const initialFormData = {
  supplier_name: "",
  company_name: "",
  phone: "",
  email: "",
  gst_number: "",
  address: "",
};

function SupplierForm({ onSupplierAdded }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.supplier_name.trim()) {
      nextErrors.supplier_name = "Supplier name is required";
    }

    if (!formData.company_name.trim()) {
      nextErrors.company_name = "Company name is required";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createSupplier(formData);

      setFormData(initialFormData);
      onSupplierAdded();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "Unable to add supplier. Please check the details and try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (fieldName) =>
    `w-full rounded-xl border p-3 pl-11 outline-none transition focus:ring-2 focus:ring-black ${
      errors[fieldName] ? "border-red-300" : "border-gray-300"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Supplier</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create vendor records for purchase and inventory workflows.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Supplier Name
          </label>
          <div className="relative">
            <UserRound className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="supplier_name"
              value={formData.supplier_name}
              placeholder="Rajesh Kumar"
              className={fieldClass("supplier_name")}
              onChange={handleChange}
            />
          </div>
          {errors.supplier_name && (
            <p className="mt-1 text-sm text-red-600">{errors.supplier_name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              placeholder="FreshMart Distributors"
              className={fieldClass("company_name")}
              onChange={handleChange}
            />
          </div>
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              placeholder="9876543210"
              className={fieldClass("phone")}
              onChange={handleChange}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="supplier@example.com"
              className={fieldClass("email")}
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            GST Number
          </label>
          <div className="relative">
            <ReceiptText className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="gst_number"
              value={formData.gst_number}
              placeholder="27ABCDE1234F1Z5"
              className={fieldClass("gst_number")}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Warehouse address"
              className={fieldClass("address")}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {submitError && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? "Adding Supplier..." : "Add Supplier"}
      </button>
    </form>
  );
}

export default SupplierForm;
