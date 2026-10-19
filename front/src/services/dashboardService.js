import API from "../api/axios";

export async function fetchDashboardSummary() {
  const response = await API.get("dashboard/summary/");
  return response.data;
}

export async function fetchSalesAnalytics(period = "week") {
  const response = await API.get("sales/analytics/", {
    params: { period },
  });
  return response.data;
}

export async function fetchRecentTransactions() {
  const response = await API.get("dashboard/recent-transactions/");
  return response.data;
}

export async function fetchLowStockItems() {
  const response = await API.get("dashboard/low-stock/");
  return response.data;
}
