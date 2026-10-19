import { useCallback, useEffect, useState } from "react";

import InvoiceTemplate from "../components/InvoiceTemplate";
import { fetchBills } from "../services/billService";
import { getApiErrorMessage } from "../services/errorService";

function Bills() {

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printingBillId, setPrintingBillId] = useState(null);
  const [error, setError] = useState("");

  const getNumber = (value) => Number(value) || 0;

  const formatCurrency = (value) =>
    `₹${getNumber(value).toFixed(2)}`;

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  const loadBills = useCallback(async () => {
    setLoading(true);
    setError("");

    try {

      setBills(await fetchBills());

    } catch (error) {

      setError(getApiErrorMessage(error, "Unable to load bills."));
      setBills([]);

    } finally {

      setLoading(false);
    }
  }, []);

  useEffect(() => {

    loadBills();

  }, [loadBills]);

  useEffect(() => {
    const clearPrintTarget = () => setPrintingBillId(null);

    window.addEventListener("afterprint", clearPrintTarget);

    return () => {
      window.removeEventListener("afterprint", clearPrintTarget);
    };
  }, []);

  const reprintBill = (billId) => {
    setPrintingBillId(billId);

    setTimeout(() => {
      window.print();
    }, 50);
  };

  return (

    <div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Saved Bills
        </h1>

        <p className="text-gray-500 mt-1">
          View invoices generated from POS billing
        </p>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {error && (
          <p className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <table className="w-full text-sm">
          <thead className="bg-gray-500">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-right">Items</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3 text-right">Tax</th>
              <th className="p-3 text-right">Grand Total</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="9">
                  Loading bills...
                </td>
              </tr>
            )}

            {!loading && bills.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="9">
                  No bills saved yet.
                </td>
              </tr>
            )}

            {!loading && bills.map((bill) => (
              <tr key={bill.id} className="border-t border-gray-200">
                <td className="p-3 font-medium">
                  #{bill.id}
                </td>
                <td className="p-3">
                  {formatDate(bill.created_at)}
                </td>
                <td className="p-3">
                  {bill.customer_phone || "-"}
                </td>
                <td className="p-3 capitalize">
                  {bill.payment_method}
                </td>
                <td className="p-3 text-right">
                  {bill.items?.length || 0}
                </td>
                <td className="p-3 text-right">
                  {formatCurrency(bill.subtotal)}
                </td>
                <td className="p-3 text-right">
                  {formatCurrency(bill.tax_amount)}
                </td>
                <td className="p-3 text-right font-bold">
                  {formatCurrency(bill.grand_total)}
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => reprintBill(bill.id)}
                    className="bg-gray-800 text-white px-3 py-2 rounded text-xs font-medium"
                  >
                    Reprint
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid w-full gap-4 mt-6">
        {bills.map((bill) => (
          <InvoiceTemplate
            key={`details-${bill.id}`}
            invoice={bill}
            className="saved-bill max-w-none"
            isPrintTarget={printingBillId === bill.id}
            onPrint={() => reprintBill(bill.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Bills;
