import { useCallback, useEffect, useState } from "react";
import { Search, Truck } from "lucide-react";

import SupplierForm from "../components/SupplierForm";
import SupplierTable from "../components/SupplierTable";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { getApiErrorMessage } from "../services/errorService";
import { fetchSuppliers } from "../services/supplierService";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setSuppliers(await fetchSuppliers(debouncedSearch));
    } catch (error) {
      setSuppliers([]);
      setError(getApiErrorMessage(error, "Unable to load suppliers."));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
            <Truck size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
          <p className="mt-1 text-gray-500">
            Manage vendor contacts for inventory and purchase operations.
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            placeholder="Search name, company, or phone..."
            className="w-full rounded-2xl border border-gray-300 bg-white p-3 pl-12 outline-none transition focus:ring-2 focus:ring-black"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6">
        <SupplierForm onSupplierAdded={loadSuppliers} />
        <SupplierTable suppliers={suppliers} loading={loading} />
      </div>
    </div>
  );
}

export default Suppliers;
