import { useEffect, useState } from "react";

import Button from "./ui/Button";
import TextInput from "./ui/TextInput";
import { createCustomer, updateCustomer } from "../services/customerService";
import { getApiErrorMessage } from "../services/errorService";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

function CustomerForm({ fetchCustomers, selectedCustomer, clearSelectedCustomer }) {
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(selectedCustomer);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        name: selectedCustomer.name || "",
        phone: selectedCustomer.phone || "",
        email: selectedCustomer.email || "",
        address: selectedCustomer.address || "",
      });

      return;
    }

    setFormData(emptyForm);
  }, [selectedCustomer]);

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
      if (isEditing) {
        await updateCustomer(selectedCustomer.id, formData);
        alert("Customer Updated");
      } else {
        await createCustomer(formData);
        alert("Customer Added");
      }

      clearSelectedCustomer();
      fetchCustomers();
      setFormData(emptyForm);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to save customer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-2xl font-bold">
        {isEditing ? "Edit Customer" : "Add Customer"}
      </h2>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          type="text"
          
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
        />

        <TextInput
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <TextInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextInput
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 px-6 py-3"
      >
        {isSubmitting
          ? "Saving..."
          : isEditing
            ? "Update Customer"
            : "Add Customer"}
      </Button>

      {isEditing && (
        <Button
          type="button"
          variant="secondary"
          className="ml-3 mt-5 px-6 py-3"
          onClick={clearSelectedCustomer}
        >
          Cancel
        </Button>
      )}
    </form>
  );
}

export default CustomerForm;
