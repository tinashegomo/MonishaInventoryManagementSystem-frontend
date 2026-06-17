import { Link } from "react-router-dom";
import { Plus, Loader2, ClipboardList } from "lucide-react";
import { useGetAllOrders } from "@/hooks/InventoryHooks";

export default function Orders() {
  const { data: orders, isLoading, isError, error } = useGetAllOrders();

  return (
    <div>
      {/* Page header */}
      <div className="mb-24 flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Orders</h1>
          <p className="mt-4 text-body-normal text-text-secondary">
            Manage customer orders
          </p>
        </div>
        <Link
          to="/orders/create-order"
          className="flex items-center gap-8 rounded-input bg-brand-primary px-20 py-12 text-body-normal font-semibold text-neutral-0 hover:bg-brand-hover active:bg-brand-pressed transition-colors duration-200"
        >
          <Plus className="h-16 w-16" />
          Create Order
        </Link>
      </div>

      {/* Error */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message || "Failed to load orders. Please try again."}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-12 rounded-card bg-surface-default shadow-elevation-1">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading orders...</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && orders && orders.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-24 shadow-elevation-1">
          <div className="mb-16 rounded-full bg-surface-muted p-16">
            <ClipboardList className="h-32 w-32 text-text-muted" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No orders yet</h3>
          <p className="mt-4 text-body-normal text-text-muted">
            Click Create Order to get started
          </p>
        </div>
      )}

      {/* Orders table */}
      {!isLoading && orders && orders.length > 0 && (
        <div className="rounded-card bg-surface-default shadow-elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-muted">
                  <th className="px-20 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Order #</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Customer</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Status</th>
                  <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Total</th>
                  <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Paid</th>
                  <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Balance</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-border-default last:border-b-0 hover:bg-surface-muted/50 transition-colors"
                  >
                    <td className="px-20 py-14 text-body-normal font-medium text-text-primary whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="px-16 py-14 text-body-normal text-text-primary whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-16 py-14 whitespace-nowrap">
                      <span className={`inline-block rounded-full px-10 py-4 text-body-small font-medium ${
                        order.orderStatus === "COMPLETED"
                          ? "bg-success-bg text-success-main"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-danger-bg text-danger-main"
                          : order.orderStatus === "IN_PRODUCTION"
                          ? "bg-warning-bg text-warning-main"
                          : order.orderStatus === "READY_FOR_COLLECTION"
                          ? "bg-brand-tint text-brand-primary"
                          : "bg-surface-muted text-text-secondary"
                      }`}>
                        {order.orderStatus?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-16 py-14 text-body-normal text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-16 py-14 text-body-normal text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${order.paidAmount?.toLocaleString()}
                    </td>
                    <td className={`px-16 py-14 text-body-normal text-right whitespace-nowrap tabular-nums font-medium ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                      ${order.balance?.toLocaleString()}
                    </td>
                    <td className="px-16 py-14 text-body-small text-text-muted whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
