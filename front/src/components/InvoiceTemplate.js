const defaultStore = {
  name: "Urban Mart Grocery Store",
  address: "Ahmedabad, Gujarat",
  phone: "+91 9876543210",
  gst: "24ABCDE1234F1Z5",
};

function InvoiceTemplate({
  invoice,
  className = "",
  id,
  isPrintTarget = false,
  showPrintButton = true,
  onPrint,
}) {
  const getNumber = (value) => Number(value) || 0;

  const formatCurrency = (value) => `₹${getNumber(value).toFixed(2)}`;

  const formatDate = (value) => {
    if (!value) {
      return new Date().toLocaleString();
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  const store = invoice?.store || defaultStore;
  const items = invoice?.items || [];
  const invoiceNumber =
    invoice?.invoiceNumber ||
    invoice?.id ||
    "New";
  const customer =
    invoice?.customer && typeof invoice.customer === "object"
      ? invoice.customer
      : {
          name: invoice?.customerName || invoice?.customer_name || "Walk-in Customer",
          phone: invoice?.customerPhone || invoice?.customer_phone || "-",
        };

  const subtotal = getNumber(invoice?.subtotal);
  const tax = getNumber(invoice?.tax ?? invoice?.tax_amount);
  const discount = getNumber(invoice?.discount);
  const grandTotal = getNumber(invoice?.grandTotal ?? invoice?.grand_total);

  const wrapperClassName = [
    "invoice-template w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl print:max-w-full print:rounded-none print:shadow-none",
    isPrintTarget ? "print-target" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div id={id} className={wrapperClassName}>
      <div className="bg-black p-8 text-white">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              {store.name}
            </h1>

            <p className="mt-2 text-sm text-gray-300">
              {store.address}
            </p>

            <p className="text-sm text-gray-300">
              Phone: {store.phone}
            </p>

            <p className="text-sm text-gray-300">
              GSTIN: {store.gst}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-2xl font-semibold">
              TAX INVOICE
            </h2>

            <p className="mt-3 text-sm text-gray-300">
              Invoice #: {invoiceNumber}
            </p>

            <p className="text-sm text-gray-300">
              Date: {formatDate(invoice?.date || invoice?.createdAt || invoice?.created_at)}
            </p>

            {invoice?.paymentMethod || invoice?.payment_method ? (
              <p className="text-sm capitalize text-gray-300">
                Payment: {invoice.paymentMethod || invoice.payment_method}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 px-8 py-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Customer Details
        </h3>

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-gray-500">Customer Name</p>
            <p className="font-medium text-gray-800">
              {customer.name || "Walk-in Customer"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium text-gray-800">
              {customer.phone || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-8 py-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm uppercase text-gray-700">
              <th className="rounded-l-xl p-4 text-left">Product</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-center">Price</th>
              <th className="rounded-r-xl p-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const quantity = item.qty || item.quantity;
              const price = item.price;
              const total = item.total;

              return (
                <tr
                  key={item.id || `${item.name || item.product_name}-${index}`}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {item.name || item.product_name || `Product #${item.product}`}
                  </td>

                  <td className="p-4 text-center text-gray-600">
                    {quantity}
                  </td>

                  <td className="p-4 text-center text-gray-600">
                    {formatCurrency(price)}
                  </td>

                  <td className="p-4 text-right font-semibold text-gray-800">
                    {formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end px-8 pb-8">
        <div className="w-full max-w-sm space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>GST / Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          {discount > 0 ? (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>{formatCurrency(discount)}</span>
            </div>
          ) : null}

          <div className="flex justify-between border-t pt-4 text-xl font-bold text-black">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Thank you for shopping with us.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Visit Again!
            </p>
          </div>

          {showPrintButton ? (
            <button
              type="button"
              onClick={onPrint || (() => window.print())}
              className="no-print rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
            >
              Print Invoice
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default InvoiceTemplate;
