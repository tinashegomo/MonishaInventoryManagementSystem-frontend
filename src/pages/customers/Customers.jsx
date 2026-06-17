import { useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import {
  useGetAllCustomers,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/InventoryHooks";
import { CustomerModal } from "@/components/customer/CustomerModal";

/**
 * Customers — read-only list page with edit and delete.
 * Creation is done during order creation (CustomerInput in CreateOrder).
 */
export default function Customers() {

  // --- Modal state ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // --- Data & mutations ---
  const { data: customers = [], isLoading, isError } = useGetAllCustomers();
  const { mutate: updateCustomer, isPending: isUpdating, error: updateError } = useUpdateCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  // --- Handlers ---

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleUpdate = (CustomerRequestDTO) => {
    updateCustomer(
      { customerId: selectedCustomer.customerId, CustomerRequestDTO },
      {
        onSuccess: () => handleCloseModal(),
      }
    );
  };

  const handleDelete = (customerId) => {
    setDeletingId(customerId);
    deleteCustomer(customerId, {
      onSettled: () => setDeletingId(null),
    });
  };

  // --- Render ---

  return (
    <div>
      {/* Page header */}
      <div className="mb-24">
        <h1 className="text-h2 font-bold text-text-primary">Customers</h1>
        <p className="mt-4 text-body-normal text-text-secondary">
          View and manage customer details
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="text-body-normal text-text-muted">Loading customers...</p>
      )}

      {/* Fetch error */}
      {isError && (
        <div className="rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          Failed to load customers. Please refresh the page.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && customers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-card border border-border-default bg-surface-default py-48 text-center">
          <Users className="mb-12 h-40 w-40 text-text-muted" />
          <p className="text-body-normal font-medium text-text-primary">
            No customers yet
          </p>
          <p className="mt-4 text-body-small text-text-muted">
            Customers are created when placing orders
          </p>
        </div>
      )}

      {/* Customers table */}
      {!isLoading && customers.length > 0 && (
        <div className="rounded-card bg-surface-default shadow-elevation-1 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default bg-surface-muted">
                <th className="px-20 py-12 text-left text-ui-label font-semibold text-text-secondary">
                  Customer Name
                </th>
                <th className="px-20 py-12 text-left text-ui-label font-semibold text-text-secondary">
                  Phone Number
                </th>
                <th className="px-20 py-12 text-left text-ui-label font-semibold text-text-secondary">
                  Date Added
                </th>
                <th className="px-20 py-12 text-right text-ui-label font-semibold text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.customerId}
                  className={`border-b border-border-default last:border-0 ${
                    index % 2 === 0 ? "bg-surface-default" : "bg-surface-muted/40"
                  }`}
                >
                  <td className="px-20 py-14">
                    <div className="flex items-center gap-10">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-brand-tint">
                        <Users className="h-16 w-16 text-brand-primary" />
                      </div>
                      <span className="text-body-normal font-medium text-text-primary">
                        {customer.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-20 py-14 text-body-normal text-text-secondary">
                    {customer.phoneNumber}
                  </td>
                  <td className="px-20 py-14 text-body-normal text-text-secondary">
                    {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-20 py-14">
                    <div className="flex items-center justify-end gap-8">
                      {/* Edit button */}
                      <button
                        onClick={() => handleOpenEdit(customer)}
                        className="rounded-input p-8 text-text-muted hover:bg-surface-muted hover:text-brand-primary transition-colors duration-200"
                        aria-label={`Edit ${customer.customerName}`}
                      >
                        <Pencil className="h-16 w-16" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(customer.customerId)}
                        disabled={isDeleting && deletingId === customer.customerId}
                        className="rounded-input p-8 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Delete ${customer.customerName}`}
                      >
                        <Trash2 className="h-16 w-16" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update error banner */}
      {updateError && (
        <div className="mt-16 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {updateError.response?.data?.message || "Failed to update customer. Please try again."}
        </div>
      )}

      {/* Edit modal */}
      <CustomerModal
        key={selectedCustomer?.customerId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdate}
        isPending={isUpdating}
        customer={selectedCustomer}
      />
    </div>
  );
}
