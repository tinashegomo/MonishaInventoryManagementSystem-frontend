import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Eye, MoreVertical, Loader2 } from "lucide-react";
import { useGetOrdersByStatus, useUpdateOrderStatus } from "@/hooks/InventoryHooks";
import { STATUS_TRANSITIONS } from "@/utils/statusUtils";
import { formatDate } from "@/utils/dateUtils";

/**
 * Tailoring — table of IN_PRODUCTION orders.
 * Tailors can view order details, see measurements, and mark orders ready for collection.
 * Uses the same table + popover pattern as Orders.jsx for consistency.
 */
export default function Tailoring() {
  // ─── State ──────────────────────────────────────────────────
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError } = useGetOrdersByStatus("IN_PRODUCTION");
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  // Dynamic position for the popover menu (same pattern as Orders.jsx)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  // ─── Functions ──────────────────────────────────────────────

  // Sort orders by createdAt descending (most recent first)
  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);

  // Update order status and close the popover
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ orderId, status: newStatus });
    const popover = document.getElementById(`menu-${orderId}`);
    if (popover) {
      popover.hidePopover();
    }
  };

  // Calculate popover position from the clicked 3-dot button
  const handleOpenMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right - 224 + window.scrollX, // 224px = w-56 dropdown width
    });
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="animate-fade-in mx-auto max-w-7xl">

      {/* ── Page Header ─── */}
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Tailoring</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Orders currently in production
          </p>
        </div>
      </div>

      {/* ── Error Banner ─── */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          Failed to load orders. Please refresh the page.
        </div>
      )}

      {/* ── Loading State ─── */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading tailoring orders...</p>
        </div>
      )}

      {/* ── Empty State ─── */}
      {!isLoading && !isError && sortedOrders.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Scissors className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">
            No orders in production
          </h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Custom orders will appear here when created.
          </p>
        </div>
      )}

      {/* ── Tailoring Orders Table ─── */}
      {!isLoading && sortedOrders.length > 0 && (
        <div className="w-full rounded-card bg-surface-default overflow-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Order #</th>
                <th className="min-w-[160px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Customer</th>
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Items</th>
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Measurements</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Balance</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Date</th>
                <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => {
                // Pre-compute custom items and measurements for this row
                const customItems = order.orderItems.filter((item) => item.customMade);
                const hasMeasurements = customItems.some((item) => item.measurements?.length > 0);
                const transitions = STATUS_TRANSITIONS[order.orderStatus] || [];

                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Order Number */}
                    <td className="min-w-[120px] px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                      {order.orderNumber}
                    </td>

                    {/* Customer Name */}
                    <td className="min-w-[160px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                      {order.customerName}
                    </td>

                    {/* Custom Items Count */}
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap">
                      {customItems.length} custom
                    </td>

                    {/* Measurements indicator */}
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap">
                      {hasMeasurements ? (
                        <span className="text-success-main font-medium">Yes</span>
                      ) : (
                        <span className="text-text-muted">None</span>
                      )}
                    </td>

                    {/* Total */}
                    <td className="w-28 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${order.totalAmount?.toLocaleString()}
                    </td>

                    {/* Balance */}
                    <td className={`w-28 px-6 py-4 text-right whitespace-nowrap tabular-nums font-medium ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                      ${order.balance?.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions: View Details + Status Menu */}
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

                        {/* Status Menu Trigger (Popover) */}
                        <button
                          popovertarget={`menu-${order.orderId}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleOpenMenu}
                          className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Status Popover Menu */}
                        <div
                          id={`menu-${order.orderId}`}
                          popover="auto"
                          style={{
                            position: "absolute",
                            top: menuPos.top,
                            left: menuPos.left,
                            margin: 0,
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
