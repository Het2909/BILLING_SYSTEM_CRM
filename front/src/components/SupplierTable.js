function SupplierTable({ suppliers, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">
                Supplier Name
              </th>
              <th className="p-4 text-left text-sm font-semibold">
                Company Name
              </th>
              <th className="p-4 text-left text-sm font-semibold">Phone</th>
              <th className="p-4 text-left text-sm font-semibold">
                GST Number
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan="4">
                  Loading suppliers...
                </td>
              </tr>
            )}

            {!loading && suppliers.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan="4">
                  No suppliers found.
                </td>
              </tr>
            )}

            {!loading &&
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">
                      {supplier.supplier_name || "-"}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {supplier.email || "No email added"}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {supplier.company_name || "-"}
                  </td>
                  <td className="p-4 text-gray-700">
                    {supplier.phone || "-"}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      {supplier.gst_number || "Not added"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupplierTable;
