import API from "../api/axios";

export async function createInvoice(payload) {
  const response = await API.post("invoices/", payload);
  return response.data;
}
