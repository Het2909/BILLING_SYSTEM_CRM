import API from "../api/axios";

export async function fetchProducts(search = "") {
  const response = await API.get(
    `products/?search=${encodeURIComponent(search)}`
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}

export async function fetchCategories() {
  const response = await API.get("categories/");

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}

export async function createProduct(payload) {
  const response = await API.post("products/", payload);
  return response.data;
}
