import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";
import LoadingSpinner from "./ui/LoadingSpinner";

function CustomerTable({ customers, loading, onEdit, onDelete }) {
  if (loading) {
    return <LoadingSpinner label="Loading customers..." />;
  }

  if (customers.length === 0) {
    return <EmptyState message="No customers found." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Loyalty Points</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b transition hover:bg-gray-50"
              >
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.email || "-"}</td>
                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {customer.loyalty_points}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    variant="info"
                    onClick={() => onEdit(customer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => onDelete(customer.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTable;
