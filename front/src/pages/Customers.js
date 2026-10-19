import { useCallback, useEffect, useState } from "react";

import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";
import Alert from "../components/ui/Alert";
import TextInput from "../components/ui/TextInput";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  deleteCustomer,
  fetchCustomers,
} from "../services/customerService";
import { getApiErrorMessage } from "../services/errorService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setCustomers(await fetchCustomers(debouncedSearch));
    } catch (error) {
      setCustomers([]);
      setError(getApiErrorMessage(error, "Unable to load customers."));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDelete = async (customerId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteCustomer(customerId);

      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null);
      }

      loadCustomers();
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to delete customer."));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customers
          </h1>

          <p className="mt-1 text-gray-500">
            Manage customer relationships
          </p>
        </div>

        <TextInput
          type="text"
          value={search}
          placeholder="Search customer..."
          className="w-full lg:w-80"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-5">
          <Alert>{error}</Alert>
        </div>
      )}

      <CustomerForm
        fetchCustomers={loadCustomers}
        selectedCustomer={selectedCustomer}
        clearSelectedCustomer={() => setSelectedCustomer(null)}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={setSelectedCustomer}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Customers;
