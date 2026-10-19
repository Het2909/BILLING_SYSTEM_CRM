import API from "../api/axios";

export async function fetchBills() {
  const response = await API.get("invoices/");

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}
