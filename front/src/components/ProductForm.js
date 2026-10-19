import { useEffect, useState } from "react";

import Button from "./ui/Button";
import TextInput from "./ui/TextInput";
import {
  createProduct,
  fetchCategories,
} from "../services/productService";
import { getApiErrorMessage } from "../services/errorService";

const emptyForm = {
  name: "",
  sku: "",
  barcode: "",
  category: "",
  selling_price: "",
  purchase_price: "",
  stock: "",
  gst_percentage: "",
};

function ProductForm({ fetchProducts }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategories(await fetchCategories());
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

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
      await createProduct(formData);
      fetchProducts();
      setFormData(emptyForm);
      alert("Product Added");
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to save product."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-bold">Add Product</h2>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TextInput
          type="text"
          name="name"
          value={formData.name}
          placeholder="Product Name"
          onChange={handleChange}
        />

        <TextInput
          type="text"
          name="sku"
          value={formData.sku}
          placeholder="SKU"
          onChange={handleChange}
        />

        <TextInput
          type="text"
          name="barcode"
          value={formData.barcode}
          placeholder="Barcode"
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          className="rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-black"
          onChange={handleChange}
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <TextInput
          type="number"
          name="selling_price"
          value={formData.selling_price}
          placeholder="Selling Price"
          onChange={handleChange}
        />

        <TextInput
          type="number"
          name="purchase_price"
          value={formData.purchase_price}
          placeholder="Purchase Price"
          onChange={handleChange}
        />

        <TextInput
          type="number"
          name="stock"
          value={formData.stock}
          placeholder="Quantity"
          onChange={handleChange}
        />

        <TextInput
          type="number"
          name="gst_percentage"
          value={formData.gst_percentage}
          placeholder="Tax %"
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 px-6 py-3"
      >
        {isSubmitting ? "Saving..." : "Add Product"}
      </Button>
    </form>
  );
}

export default ProductForm;
