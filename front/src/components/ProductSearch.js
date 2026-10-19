import { useCallback, useEffect, useState } from "react";

import EmptyState from "./ui/EmptyState";
import LoadingSpinner from "./ui/LoadingSpinner";
import TextInput from "./ui/TextInput";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { getApiErrorMessage } from "../services/errorService";
import { fetchProducts } from "../services/productService";

function ProductSearch({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
      <TextInput
        type="text"
        value={search}
        placeholder="Search Product or Scan Barcode..."
        className="mb-4 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState message="No products found." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-xl border border-gray-200 p-3 text-left transition hover:border-gray-400 hover:bg-gray-50"
            >
              <h2 className="font-bold">{product.name}</h2>
              <p>Rs. {product.selling_price}</p>
              <p className="text-sm text-gray-500">
                Stock: {product.stock_quantity}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
