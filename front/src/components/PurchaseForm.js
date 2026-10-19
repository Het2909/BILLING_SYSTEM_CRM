import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { getApiErrorMessage } from "../services/errorService";
import { fetchProducts } from "../services/productService";
import { createPurchase } from "../services/purchaseService";
import { fetchSuppliers } from "../services/supplierService";

const emptyItem = {
  product: "",
  quantity: "",
  purchase_price: "",
};

function PurchaseForm({ onPurchaseSaved }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOptions = useCallback(async () => {
    try {
      const [supplierList, productList] = await Promise.all([
        fetchSuppliers(),
        fetchProducts(),
      ]);

      setSuppliers(supplierList);
      setProducts(productList);
    } catch {
      setError("Unable to load suppliers or products.");
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const getNumber = (value) => Number(value) || 0;

  const formatCurrency = (value) => `Rs. ${getNumber(value).toFixed(2)}`;

  const selectedProduct = products.find(
    (product) => String(product.id) === String(currentItem.product)
  );

  const currentSubtotal =
    getNumber(currentItem.quantity) * getNumber(currentItem.purchase_price);

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + getNumber(item.quantity) * getNumber(item.purchase_price),
        0
      ),
    [items]
  );

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    if (name === "product") {
      const product = products.find(
        (productItem) => String(productItem.id) === String(value)
      );

      setCurrentItem({
        ...currentItem,
        product: value,
        purchase_price: product?.purchase_price || "",
      });
      setError("");
      return;
    }

    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
    setError("");
  };

  const addItem = () => {
    if (!currentItem.product) {
      setError("Select a product before adding an item.");
      return;
    }

    if (getNumber(currentItem.quantity) <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (getNumber(currentItem.purchase_price) <= 0) {
      setError("Enter a valid purchase price.");
      return;
    }

    setItems([
      ...items,
      {
        ...currentItem,
        product_name: selectedProduct?.name || "Product",
      },
    ]);
    setCurrentItem(emptyItem);
    setError("");
  };

  const removeItem = (index) => {
    setItems(items.filter((item, itemIndex) => itemIndex !== index));
  };

  const resetForm = () => {
    setSupplier("");
    setInvoiceNumber("");
    setCurrentItem(emptyItem);
    setItems([]);
  };

  const savePurchase = async (e) => {
    e.preventDefault();

    if (!supplier) {
      setError("Select a supplier.");
      return;
    }

    if (!invoiceNumber.trim()) {
      setError("Enter invoice number.");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one product to the purchase.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await createPurchase({
        supplier,
        invoice_number: invoiceNumber.trim(),
        items: items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          purchase_price: Number(item.purchase_price),
        })),
      });

      resetForm();
      onPurchaseSaved();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to save purchase. Please check details and try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={savePurchase}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-bold text-gray-900">New Purchase</h2>
        <p className="mt-1 text-sm text-gray-500">
          Record supplier invoices and update product stock automatically.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Supplier
          </label>
          <select
            value={supplier}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:ring-2 focus:ring-black"
            onChange={(e) => {
              setSupplier(e.target.value);
              setError("");
            }}
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplierItem) => (
              <option key={supplierItem.id} value={supplierItem.id}>
                {supplierItem.company_name} - {supplierItem.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Invoice Number
          </label>
          <input
            type="text"
            value={invoiceNumber}
            placeholder="PUR-1001"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:ring-2 focus:ring-black"
            onChange={(e) => {
              setInvoiceNumber(e.target.value);
              setError("");
            }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Product
            </label>
            <select
              name="product"
              value={currentItem.product}
              className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-black"
              onChange={handleItemChange}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.stock_quantity ?? product.stock} in stock)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={currentItem.quantity}
              placeholder="0"
              className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-black"
              onChange={handleItemChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Purchase Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="purchase_price"
              value={currentItem.purchase_price}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-black"
              onChange={handleItemChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Subtotal
            </label>
            <div className="rounded-xl border border-gray-200 bg-white p-3 font-semibold text-gray-900">
              {formatCurrency(currentSubtotal)}
            </div>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.4fr_0.5fr_0.7fr_0.7fr_48px] bg-black px-4 py-3 text-sm font-semibold text-white">
              <span>Product</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Price</span>
              <span className="text-right">Subtotal</span>
              <span></span>
            </div>

            {items.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Added products will appear here.
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product}-${index}`}
                  className="grid grid-cols-[1.4fr_0.5fr_0.7fr_0.7fr_48px] items-center border-b border-gray-100 px-4 py-3 text-sm transition hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{item.product_name}</span>
                  <span className="text-right text-gray-700">{item.quantity}</span>
                  <span className="text-right text-gray-700">
                    {formatCurrency(item.purchase_price)}
                  </span>
                  <span className="text-right font-semibold text-gray-900">
                    {formatCurrency(getNumber(item.quantity) * getNumber(item.purchase_price))}
                  </span>
                  <button
                    type="button"
                    className="ml-auto rounded-xl p-2 text-red-600 transition hover:bg-red-50"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Purchase Amount</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <Save size={18} />
          {isSubmitting ? "Saving Purchase..." : "Save Purchase"}
        </button>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}

export default PurchaseForm;
