import API from "../api/axios";

export async function fetchCustomers(search = "") {
  const response = await API.get(
    `customers/?search=${encodeURIComponent(search)}`
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}

export async function createCustomer(payload) {
  const response = await API.post("customers/", payload);
  return response.data;
}

export async function updateCustomer(customerId, payload) {
  const response = await API.put(`customers/${customerId}/`, payload);
  return response.data;
}

export async function deleteCustomer(customerId) {
  await API.delete(`customers/${customerId}/`);
}

export async function getOrCreateCustomerByPhone(phone) {
  const customerList = await fetchCustomers(phone);

  const existingCustomer = customerList.find(
    (customer) => customer.phone === phone
  );

  if (existingCustomer) {
    return existingCustomer;
  }

  return createCustomer({
    name: "Walk-in Customer",
    phone,
    email: "",
    address: "",
  });
}
