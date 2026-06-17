import { Trash2 } from "lucide-react";

// Format ISO date string to readable format
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZW", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * WarehouseBatchList — table displaying all warehouse batches.
 * Each row shows batch details, quantities, prices, sizes, and delete action.
 */
export const WarehouseBatchList = ({batches,setSelectedItem}) => {
    return (
        <div className="rounded-card bg-surface-default shadow-elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-muted">
                  <th className="px-24 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Batch Name</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Type</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Variant</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Color</th>
                  <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Total Qty</th>
                  <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Price/Unit</th>
                  <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Total Price</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Sizes</th>
                  <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Created</th>
                  <th className="px-24 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr
                    key={batch.batchId}
                    className="border-b border-border-default last:border-b-0 hover:bg-surface-muted/50 transition-colors"
                  >
                    <td className="px-24 py-16 text-body-normal font-medium text-text-primary whitespace-nowrap">
                      {batch.batchName}
                    </td>
                    <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                      {batch.type}
                    </td>
                    <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                      {batch.variant}
                    </td>
                    <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                      {batch.color}
                    </td>
                    <td className="px-16 py-16 text-body-normal text-text-primary text-right whitespace-nowrap tabular-nums">
                      {batch.totalQuantity}
                    </td>
                    <td className="px-16 py-16 text-body-normal text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${batch.batchPrice?.toLocaleString()}
                    </td>
                    <td className="px-16 py-16 text-body-normal font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${batch.totalPrice?.toLocaleString()}
                    </td>
                    {/* Size:quantity pairs — e.g. "32:80, 34:50" */}
                    <td className="px-16 py-16 text-body-small text-text-muted whitespace-nowrap">
                      {batch.batchSizes
                        ?.map((s) => `${s.size}:${s.quantity}`)
                        .join(", ") || "-"}
                    </td>
                    <td className="px-16 py-16 text-body-small text-text-muted whitespace-nowrap">
                      {formatDate(batch.createdAt)}
                    </td>
                    <td className="px-24 py-16 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedItem(batch)}
                        className="rounded-input p-8 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-colors"
                        aria-label={`Delete ${batch.batchName}`}
                      >
                        <Trash2 className="h-16 w-16" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
};