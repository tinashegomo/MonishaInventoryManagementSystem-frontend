import { Plus } from "lucide-react";
import OrderItemRow from "./OrderItemRow";

/**
 * OrderItemList — the Order Items card section.
 *
 * Contains header with "Add Item" button, empty state,
 * and maps through items rendering an OrderItemRow for each.
 * Receives all data and callbacks via props from CreateOrder.
 */
export default function OrderItemList({orderItems,existingProducts,existingBatches,manageItem,manageMeasurement,}) {
  return (
    <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
      {/* ─── Header + Add button ─── */}
      <div className="mb-16 flex items-center justify-between">
        <h2 className="text-h4 font-semibold text-text-primary">Order Items</h2>
        <button
          type="button"
          onClick={() => manageItem("add")}
          className="flex items-center gap-8 rounded-input border border-border-default px-16 py-8 text-body-small font-medium text-brand-primary hover:bg-brand-tint transition-colors duration-200"
        >
          <Plus className="h-14 w-14" />
          Add Item
        </button>
      </div>

      {/* ─── Empty state ─── */}
      {orderItems.length === 0 && (
        <p className="text-body-small text-text-muted">
          No items added yet. Click Add Item to begin.
        </p>
      )}

      {/* ─── Item rows ─── */}
      <div className="space-y-16">
        {orderItems.map((item, index) => (
          <OrderItemRow
            key={item.id}
            item={item}
            index={index}
            existingProducts={existingProducts}
            existingBatches={existingBatches}
            onManageItem={manageItem}
            onManageMeasurement={manageMeasurement}
          />
        ))}
      </div>
    </div>
  );
}
