import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  // CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FilePlus2,
  PackagePlus,
  ReceiptText,
  Search,
  ShoppingBasket,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";

import Alert from "../components/ui/Alert";
import {
  fetchDashboardSummary,
  fetchSalesAnalytics,
  fetchRecentTransactions,
  fetchLowStockItems,
} from "../services/dashboardService";
import { getApiErrorMessage } from "../services/errorService";

const filterLabels = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    todays_sales: 0,
    products: 0,
    customers: 0,
    low_stock: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");
  const [lowStockError, setLowStockError] = useState("");
  const [salesFilter, setSalesFilter] = useState("week");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      setError("");

      try {
        setSummary(await fetchDashboardSummary());
      } catch (error) {
        setError(getApiErrorMessage(error, "Unable to load dashboard data."));
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  useEffect(() => {
    async function loadSalesAnalytics() {
      setChartsLoading(true);
      try {
        const data = await fetchSalesAnalytics(salesFilter);
        setChartData(data);
      } catch (error) {
        console.error("Failed to load sales analytics:", error);
      } finally {
        setChartsLoading(false);
      }
    }

    loadSalesAnalytics();
  }, [salesFilter]);

  useEffect(() => {
    async function loadRecentTransactions() {
      setTransactionsLoading(true);
      setTransactionsError("");

      try {
        setRecentTransactions(await fetchRecentTransactions());
      } catch (error) {
        setTransactionsError(getApiErrorMessage(error, "Unable to load recent transactions."));
      } finally {
        setTransactionsLoading(false);
      }
    }

    loadRecentTransactions();
  }, []);

  useEffect(() => {
    async function loadLowStockItems() {
      setLowStockLoading(true);
      setLowStockError("");

      try {
        setLowStockItems(await fetchLowStockItems());
      } catch (error) {
        setLowStockError(getApiErrorMessage(error, "Unable to load low stock alerts."));
      } finally {
        setLowStockLoading(false);
      }
    }

    loadLowStockItems();
  }, []);

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredTransactions = useMemo(() => {
    const query = transactionSearch.trim().toLowerCase();

    if (!query) {
      return recentTransactions;
    }

    return recentTransactions.filter((transaction) =>
      [
        transaction.invoice,
        transaction.customer,
        transaction.method,
        transaction.status,
        transaction.date,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [transactionSearch, recentTransactions]);

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const pageTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [transactionSearch]);

  const cards = [
    {
      title: "Today's Sales",
      value: formatCurrency(summary.todays_sales),
      trend: "+12% from yesterday",
      icon: CircleDollarSign,
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Total Products",
      value: summary.products,
      trend: "42 fast-moving items",
      icon: ShoppingBasket,
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      title: "Customers",
      value: summary.customers,
      trend: "+18 new this week",
      icon: Users,
      gradient: "from-indigo-600 to-blue-500",
    },
    {
      title: "Low Stock",
      value: summary.low_stock,
      trend: "Needs attention today",
      icon: AlertTriangle,
      gradient: "from-rose-600 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-100">
      <section className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Clock3 size={14} />
              Live Grocery POS Dashboard
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              Good evening, Het
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track sales, stock movement, customer billing, and store activity from one clean command center.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end">
            <button
              onClick={() => navigate("/billing")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              <FilePlus2 size={18} />
              New Bill
            </button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
            >
              <PackagePlus size={18} />
              Add Product
            </Link>
            <Link
              to="/customers"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
            >
              <UserPlus size={18} />
              Add Customer
            </Link>
            <Link
              to="/bills"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
            >
              <BarChart3 size={18} />
              View Reports
            </Link>
          </div>
        </div>
      </section>

      {error && <Alert>{error}</Alert>}
      {transactionsError && <Alert>{transactionsError}</Alert>}
      {lowStockError && <Alert>{lowStockError}</Alert>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <StatCard
            key={card.title}
            card={card}
            index={index}
            loading={loading}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
              <TrendingUp size={18} />
              Sales Analytics
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Sales Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Daily sales, weekly revenue, and monthly profit trends with active period filtering.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {Object.entries(filterLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSalesFilter(key)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  salesFilter === key
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
          <SalesChart data={chartData} loading={chartsLoading} />

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricTile
              label={salesFilter === "today" ? "Today's Sales" : salesFilter === "week" ? "Daily Average" : "Weekly Average"}
              value={chartData.length > 0 ? formatCurrency(chartData[chartData.length - 1].revenue) : formatCurrency(0)}
              trend="+12% from previous period"
              icon={ReceiptText}
              loading={chartsLoading}
            />
            <MetricTile
              label="Total Revenue"
              value={chartData.length > 0 ? formatCurrency(chartData.reduce((sum, item) => sum + item.revenue, 0)) : formatCurrency(0)}
              trend="+8.4% from last period"
              icon={WalletCards}
              loading={chartsLoading}
            />
            <MetricTile
              label="Total Profit"
              value={chartData.length > 0 ? formatCurrency(chartData.reduce((sum, item) => sum + item.profit, 0)) : formatCurrency(0)}
              trend="+15.2% net margin lift"
              icon={ArrowUpRight}
              loading={chartsLoading}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <RecentTransactions
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          page={page}
          pageCount={pageCount}
          pageTransactions={pageTransactions}
          search={transactionSearch}
          setPage={setPage}
          setSearch={setTransactionSearch}
          total={filteredTransactions.length}
          loading={transactionsLoading}
        />
        <LowStockPanel
          items={lowStockItems}
          loading={lowStockLoading}
        />
      </section>

      <Link
        to="/billing"
        className="fixed bottom-6 right-6 z-20 inline-flex h-14 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-2xl shadow-blue-600/30 transition hover:-translate-y-1 hover:bg-blue-700"
      >
        <FilePlus2 size={20} />
        New Bill
      </Link>
    </div>
  );
}

function StatCard({ card, index, loading }) {
  const Icon = card.icon;

  return (
    <article
      className={`dashboard-rise rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg shadow-slate-300/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {loading ? (
        <div className="space-y-4">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/20" />
          <div className="h-4 w-28 animate-pulse rounded bg-white/20" />
          <div className="h-8 w-24 animate-pulse rounded bg-white/20" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-xl bg-white/20 p-3 ring-1 ring-white/30">
              <Icon size={24} />
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white/90">
              Live
            </span>
          </div>
          <p className="mt-5 text-sm font-medium text-white/80">{card.title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{card.value}</p>
          <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-white/90">
            <ArrowUpRight size={16} />
            {card.trend}
          </p>
        </>
      )}
    </article>
  );
}

function SalesChart({ data, loading }) {
  if (loading) {
    return (
      <div className="min-h-[360px] rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-64 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[360px] rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-center">
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  const width = 760;
  const height = 300;
  const padding = 36;
  const maxValue = Math.max(...data.flatMap((item) => [item.sales, item.revenue, item.profit]));
  const xStep = (width - padding * 2) / Math.max(data.length - 1, 1);

  const getPoint = (value, index) => {
    const x = padding + index * xStep;
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  };

  const lineFor = (key) => data.map((item, index) => getPoint(item[key], index)).join(" ");

  return (
    <div className="min-h-[360px] rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <ChartLegend color="bg-blue-600" label="Daily sales" />
        <ChartLegend color="bg-emerald-500" label="Weekly revenue" />
        <ChartLegend color="bg-amber-500" label="Monthly profit" />
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[300px] min-w-[680px] overflow-visible"
          role="img"
          aria-label="Sales overview chart"
        >
          {[0.25, 0.5, 0.75, 1].map((tick) => {
            const y = height - padding - tick * (height - padding * 2);
            return (
              <line
                key={tick}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="5 7"
              />
            );
          })}
          <polyline
            className="dashboard-line"
            points={lineFor("revenue")}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            className="dashboard-line dashboard-line-delay"
            points={lineFor("sales")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            className="dashboard-line dashboard-line-late"
            points={lineFor("profit")}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => {
            const [x, y] = getPoint(item.sales, index).split(",").map(Number);
            return (
              <g key={item.label}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-white stroke-blue-600"
                  strokeWidth="3"
                />
                <text
                  x={x}
                  y={height - 9}
                  textAnchor="middle"
                  className="fill-slate-500 text-[12px] font-semibold"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function ChartLegend({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, trend, loading }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-blue-50 p-2 text-blue-700">
          {loading ? (
            <div className="h-5 w-5 animate-pulse rounded bg-blue-200" />
          ) : (
            <Icon size={20} />
          )}
        </span>
        <span className="text-sm font-semibold text-slate-500">{label}</span>
      </div>
      <div className="mt-4 text-2xl font-bold text-slate-950">
        {loading ? (
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        ) : (
          value
        )}
      </div>
      <p className="mt-2 text-xs font-semibold text-emerald-600">{trend}</p>
    </div>
  );
}

function RecentTransactions({
  formatCurrency,
  formatDate,
  page,
  pageCount,
  pageTransactions,
  search,
  setPage,
  setSearch,
  total,
  loading,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Recent Transactions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest invoices, payment modes, and billing status.
          </p>
        </div>
        <label className="relative block md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transactions"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="mt-5 max-h-[390px] overflow-auto rounded-xl border border-slate-100">
        <table className="min-w-[780px] w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Invoice</th>
              <th className="px-4 py-3 font-bold">Customer</th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Payment</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Date / Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="transition hover:bg-blue-50/60">
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageTransactions.length > 0 ? (
              pageTransactions.map((transaction) => (
                <tr
                  key={transaction.invoice}
                  className="transition hover:bg-blue-50/60"
                >
                  <td className="px-4 py-3 font-bold text-slate-900">{transaction.invoice}</td>
                  <td className="px-4 py-3 text-slate-600">{transaction.customer}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      <CreditCard size={13} />
                      {transaction.method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(transaction.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {pageTransactions.length} of {total} transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold text-slate-700">
            {page} / {pageCount}
          </span>
          <button
            onClick={() => setPage(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Refunded: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
}

function LowStockPanel({ items = [], loading }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Low Stock Alerts</h2>
          <p className="mt-1 text-sm text-slate-500">
            Products below reorder threshold.
          </p>
          
        </div>
        <span className="rounded-xl bg-rose-50 p-2 text-rose-600">
          <AlertTriangle size={22} />
        </span>
      </div>

      {/* <button onClick={() => console.log(items)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
        click here
      </button> */}

      <div className="mt-5 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="min-w-0 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="h-9 w-20 animate-pulse rounded bg-slate-200" />
            </div>
          ))
        ) : items.length > 0 ? (
          items.map((item) => {
            const isCritical = item.severity === "critical";

            return (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">{item.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isCritical ? "bg-red-500" : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        isCritical ? "text-red-600" : "text-amber-600"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </div>
                </div>
                <button className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 hover:shadow-sm">
                  Restock
                </button>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No low stock items found.
          </div>
        )}
      </div>

      {/* <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
          <CalendarDays size={16} />
          Today&apos;s reorder plan
        </div>
        <p className="mt-3 text-2xl font-bold">4 items</p>
        <p className="mt-1 text-sm text-slate-300">
          Prioritize dairy and cooking essentials before evening rush.
        </p>
      </div> */}
    </aside>
  );
}

export default Dashboard;
