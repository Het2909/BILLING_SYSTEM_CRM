function PurchaseTable({ purchases, loading }) {
  const getNumber = (value) => Number(value) || 0;

  const formatCurrency = (value) => `Rs. ${getNumber(value).toFixed(2)}`;

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
        <p className="mt-1 text-sm text-gray-500">
          Supplier invoices and stock receiving records.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">
                Invoice Number
              </th>
              <th className="p-4 text-left text-sm font-semibold">Supplier</th>
              <th className="p-4 text-right text-sm font-semibold">Items</th>
              <th className="p-4 text-right text-sm font-semibold">
                Total Amount
              </th>
              <th className="p-4 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan="5">
                  Loading purchases...
                </td>
              </tr>
            )}

            {!loading && purchases.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan="5">
                  No purchase history found.
                </td>
              </tr>
            )}

            {!loading &&
              purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold text-gray-900">
                    {purchase.invoice_number}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {purchase.supplier_company || "-"}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {purchase.supplier_name || "Supplier"}
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-700">
                    {purchase.items?.length || 0}
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    {formatCurrency(purchase.total_amount)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {formatDate(purchase.created_at)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseTable;
