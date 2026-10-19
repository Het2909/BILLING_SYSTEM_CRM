import { useMemo, useState } from "react";

import InvoiceTemplate from "./InvoiceTemplate";
import { createInvoice } from "../services/invoiceService";
import { getOrCreateCustomerByPhone } from "../services/customerService";
import { getApiErrorMessage } from "../services/errorService";

const getNumber = (value) => Number(value) || 0;

function BillingSummary({ cart, setCart, bill, setBill }) {
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + getNumber(item.selling_price) * getNumber(item.quantity),
      0
    );

    const tax = cart.reduce((sum, item) => {
      const lineTotal = getNumber(item.selling_price) * getNumber(item.quantity);
      return sum + (lineTotal * getNumber(item.gst_percentage)) / 100;
    }, 0);

    const discountValue = getNumber(discount);

    return {
      subtotal,
      tax,
      discount: discountValue,
      grandTotal: Math.max(subtotal + tax - discountValue, 0),
    };
  }, [cart, discount]);

  const formatCurrency = (value) => `₹${getNumber(value).toFixed(2)}`;

  const createPreviewInvoice = () => ({
    invoiceNumber: "Preview",
    date: new Date().toISOString(),
    customer: {
      name: "Walk-in Customer",
      phone: customerPhone.trim() || "-",
    },
    items: cart.map((item) => {
      const quantity = getNumber(item.quantity);
      const price = getNumber(item.selling_price);
      const itemTotal = price * quantity;
      const tax = (itemTotal * getNumber(item.gst_percentage)) / 100;

      return {
        id: item.id,
        name: item.name,
        qty: quantity,
        price,
        total: itemTotal + tax,
      };
    }),
    subtotal: totals.subtotal,
    tax: totals.tax,
    discount: totals.discount,
    grandTotal: totals.grandTotal,
    paymentMethod,
  });

  const handleCreateBill = async () => {
    if (cart.length === 0) {
      setError("Add at least one product to create an invoice.");
      return;
    }

    if (totals.discount > totals.subtotal + totals.tax) {
      setError("Discount cannot be greater than the bill total.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let customerId = null;
      const phone = customerPhone.trim();

      if (phone) {
        const customer = await getOrCreateCustomerByPhone(phone);
        customerId = customer.id;
      }

      const createdBill = await createInvoice({
        customer: customerId,
        payment_method: paymentMethod,
        discount: totals.discount,
        items: cart.map((item) => ({
          product: item.id,
          quantity: getNumber(item.quantity),
        })),
      });

      setBill(createdBill);
      setCart([]);
      setCustomerPhone("");
      setDiscount("");

      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to create invoice."));
    } finally {
      setSaving(false);
    }
  };

  const printableInvoice = bill || createPreviewInvoice();

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(280px,380px)_1fr]">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Bill Summary</h2>

        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <label className="mb-4 block text-sm font-medium text-gray-700">
          Customer Phone
          <input
            type="tel"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="+91 9999999999"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-500"
          />
        </label>

        <label className="mb-4 block text-sm font-medium text-gray-700">
          Payment Method
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-500"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </label>

        <label className="mb-5 block text-sm font-medium text-gray-700">
          Discount
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            placeholder="0"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-500"
          />
        </label>

        <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>GST / Tax</span>
            <span>{formatCurrency(totals.tax)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span>{formatCurrency(totals.discount)}</span>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-black">
            <span>Grand Total</span>
            <span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateBill}
          disabled={saving || cart.length === 0}
          className="mt-5 w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? "Creating Invoice..." : "Create Invoice"}
        </button>
      </div>

      <div className="min-h-screen bg-gray-100 px-4 py-10 print:bg-white">
        <InvoiceTemplate
          id="generated-bill"
          invoice={printableInvoice}
          showPrintButton={Boolean(bill)}
        />
      </div>
    </div>
  );
}

export default BillingSummary;
