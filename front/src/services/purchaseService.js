import API from "../api/axios";

export async function fetchPurchases(search = "") {
  const response = await API.get(
    `purchases/?search=${encodeURIComponent(search)}`
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}

export async function createPurchase(payload) {
  const response = await API.post("purchases/", payload);
  return response.data;
}
