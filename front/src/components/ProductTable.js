import EmptyState from "./ui/EmptyState";
import LoadingSpinner from "./ui/LoadingSpinner";

function ProductTable({ products, loading }) {
  if (loading) {
    return <LoadingSpinner label="Loading products..." />;
  }

  if (products.length === 0) {
    return <EmptyState message="No products found." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b transition hover:bg-gray-50"
              >
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.sku || "-"}</td>
                <td className="p-4">{product.category_name || "-"}</td>
                <td className="p-4">Rs. {product.selling_price}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      product.stock_quantity <= 10
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {product.stock_quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
