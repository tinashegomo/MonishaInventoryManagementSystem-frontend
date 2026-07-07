import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Loader2, ClipboardList, Eye, MoreVertical, FileSpreadsheet, FileText } from "lucide-react";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/InventoryHooks";
import { STATUS_TRANSITIONS, STATUS_COLORS } from "@/utils/statusUtils";
import { formatDate } from "@/utils/dateUtils";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

// ─── Export column definitions ──────────────────────────────
const ORDER_COLUMNS = [
  { header: "Order #", key: "orderNumber" },
  { header: "Customer", key: "customerName" },
  { header: "Status", key: "orderStatus" },
  { header: "Total", key: "totalAmount" },
  { header: "Paid", key: "paidAmount" },
  { header: "Balance", key: "balance" },
  { header: "Date", key: "createdAt" },
  { header: "Created By", key: "createdBy" },
];

export default function Orders() {
  // ─── State ────────────────────────────────────────────────────
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, error } = useGetAllOrders();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  // We store the dynamic pixel coordinates of the clicked 3-dot button.
  // Since only one popover can be open at a time (thanks to popover="auto"),
  // we only need a single state object to position the active popover.
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  // ─── Functions ────────────────────────────────────────────────

  // Sort orders by createdAt descending (most recent first)
  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ orderId, status: newStatus });
    // After performing the action, manually close the native popover
    const popover = document.getElementById(`menu-${orderId}`);
    if (popover) {
      popover.hidePopover();
    }
  };

  const handleOpenMenu = (e) => {
    // e.currentTarget is the button that was clicked.
    // getBoundingClientRect() gives us its exact position on the viewport.
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Position the popover slightly below the clicked button, accounting for page scroll.
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right - 224 + window.scrollX, // 224px matches the w-56 width of our dropdown
    });
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      {/* ── Page Header ─── */}
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Orders</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage customer orders
          </p>
        </div>
        <div className="flex items-center gap-8">
          {sortedOrders.length > 0 && (
            <>
              <button
                onClick={() => exportToExcel(sortedOrders, ORDER_COLUMNS, "orders")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileSpreadsheet className="h-16 w-16" />
                Excel
              </button>
              <button
                onClick={() => exportToPDF(sortedOrders, ORDER_COLUMNS, "Orders", "orders")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileText className="h-16 w-16" />
                PDF
              </button>
            </>
          )}
          <Link
            to="/orders/create-order"
            className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
          >
            <Plus className="h-16 w-16" />
            Create Order
          </Link>
        </div>
      </div>

      {/* ── Error ─── */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load orders. Please try again."}
        </div>
      )}

      {/* ── Loading ─── */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading orders...</p>
        </div>
      )}

      {/* ── Empty State ─── */}
      {!isLoading && !isError && sortedOrders.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <ClipboardList className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No orders yet</h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by creating your first order.
          </p>
        </div>
      )}

      {/* ── Orders Table ─── */}
      {!isLoading && sortedOrders.length > 0 && (
        <div className="w-full rounded-card bg-surface-default overflow-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Order #</th>
                <th className="min-w-[160px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Customer</th>
                <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Status</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Paid</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Balance</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Date</th>
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Created By</th>
                <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => {
                // Pre-compute the valid status transitions for this specific order row.
                const transitions = STATUS_TRANSITIONS[order.orderStatus] || [];

                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="min-w-[120px] px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="min-w-[160px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                      {order.customerName}
                    </td>
                    <td className={`min-w-[140px] px-6 py-4 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[order.orderStatus] || "text-gray-600"}`}>
                      {order.orderStatus?.replace(/_/g, " ")}
                    </td>
                    <td className="w-28 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="w-28 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                      ${order.paidAmount?.toLocaleString()}
                    </td>
                    <td className={`w-28 px-6 py-4 text-right whitespace-nowrap tabular-nums font-medium ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                      ${order.balance?.toLocaleString()}
                    </td>
                    <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="min-w-[120px] px-6 py-4 text-xs text-text-muted whitespace-nowrap truncate" title={order.createdBy || ""}>
                      {order.createdBy || "-"}
                    </td>
                    <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-4">
                        {/* View Details Button */}
                        <button
                          onClick={() => navigate(`/orders/${order.orderId}`)}
                          className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                          aria-label={`View ${order.orderNumber}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* Dropdown Toggle Button using Native HTML5 Popover Trigger */}
                        {/* popovertarget connects this button to the div with the matching ID */}
                        <button
                          popovertarget={`menu-${order.orderId}`}
                          onMouseDown={(e) => e.preventDefault()} // prevents focus flashing
                          onClick={handleOpenMenu} // sets the position on click
                          className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Native HTML5 Popover Menu */}
                        {/* popover="auto" tells the browser to put this element in the "Top Layer" */}
                        {/* rendering it completely outside the table structure. This makes it */}
                        {/* 100% immune to overflow-hidden / overflow-x-auto clipping. */}
                        {/* It also handles auto-dismiss (closes when you click outside or press ESC) */}
                        <div
                          id={`menu-${order.orderId}`}
                          popover="auto"
                          style={{
                            position: "absolute", // allows manual coordinates relative to document
                            top: menuPos.top,
                            left: menuPos.left,
                            margin: 0, // clears browser-default centering margins
                          }}
                          className="w-56 whitespace-nowrap rounded-input border border-border-default bg-surface-default py-4 shadow-elevation-2 focus-visible:outline-none"
                        >
                          {transitions.length === 0 ? (
                            <p className="px-16 py-8 text-body-small leading-none text-text-muted">No actions available</p>
                          ) : (
                            transitions.map((t, i) => (
                              <div key={t.status}>
                                {t.status === "CANCELLED" && i > 0 && (
                                  <div className="my-2 border-t border-border-default" />
                                )}
                                <button
                                  onClick={() => handleStatusChange(order.orderId, t.status)}
                                  className={`flex w-full items-center gap-8 px-16 py-8 text-left text-body-small leading-none transition-colors ${
                                    t.status === "CANCELLED"
                                      ? "text-danger-main hover:bg-danger-bg"
                                      : "text-text-primary hover:bg-surface-muted"
                                  }`}
                                >
                                  {t.label}
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
