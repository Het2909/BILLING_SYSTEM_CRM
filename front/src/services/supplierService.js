import API from "../api/axios";

export async function fetchSuppliers(search = "") {
  const response = await API.get(
    `suppliers/?search=${encodeURIComponent(search)}`
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}

export async function createSupplier(payload) {
  const response = await API.post("suppliers/", payload);
  return response.data;
}
