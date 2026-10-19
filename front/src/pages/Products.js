import { useCallback, useEffect, useState } from "react";

import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import Alert from "../components/ui/Alert";
import TextInput from "../components/ui/TextInput";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { fetchProducts } from "../services/productService";
import { getApiErrorMessage } from "../services/errorService";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setProducts(await fetchProducts(debouncedSearch));
    } catch (error) {
      setProducts([]);
      setError(getApiErrorMessage(error, "Unable to load products."));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Products
          </h1>

          <p className="mt-1 text-gray-500">
            Manage inventory and stock
          </p>
        </div>

        <TextInput
          type="text"
          value={search}
          placeholder="Search products..."
          className="w-full lg:w-96"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-5">
          <Alert>{error}</Alert>
        </div>
      )}

      <ProductForm fetchProducts={loadProducts} />
      <ProductTable products={products} loading={loading} />
    </div>
  );
}

export default Products;
