import { Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parseDate, formatDate } from "@/utils/dateUtils";

// ─── Helpers ──────────────────────────────────────────────────

const getTotalQty = (batch) => batch.batchSizes?.reduce((sum, s) => sum + s.quantity, 0) || batch.totalQuantity || 0;
const getTotalValue = (batch) => getTotalQty(batch) * (batch.batchPrice || 0);

// ─── Component ────────────────────────────────────────────────

export const WarehouseBatchList = ({ batches, setSelectedItem }) => {

  // ─── Hooks ────────────────────────────────────────────────────
  const navigate = useNavigate();

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="w-full rounded-card bg-surface-default">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="min-w-[220px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Batch Name</th>
            <th className="min-w-[100px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Type</th>
            <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Variant</th>
            <th className="min-w-[100px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Color</th>
            <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Qty</th>
            <th className="w-32 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Price</th>
            <th className="w-32 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
            <th className="w-40 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Created</th>
            <th className="w-32 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">By</th>
            <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => {
            return (
              <tr
                key={batch.batchId}
                className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="min-w-[220px] px-6 py-4 font-medium text-text-primary whitespace-nowrap truncate" title={batch.batchName}>
                  {batch.batchName}
                </td>
                <td className="min-w-[100px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {batch.type}
                </td>
                <td className="min-w-[140px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {batch.variant}
                </td>
                <td className="min-w-[100px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {batch.color}
                </td>
                <td className="w-24 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                  {getTotalQty(batch)}
                </td>
                <td className="w-32 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                  ${batch.batchPrice?.toLocaleString()}
                </td>
                <td className="w-32 px-6 py-4 font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                  ${getTotalValue(batch).toLocaleString()}
                </td>
                <td className="w-40 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                  {formatDate(batch.createdAt)}
                </td>
                <td className="w-32 px-6 py-4 text-xs text-text-secondary whitespace-nowrap truncate" title={batch.createdBy || ""}>
                  {batch.createdBy || "-"}
                </td>
                <td className="w-24 px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/warehouse/${batch.batchId}`)}
                    className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                    aria-label={`View ${batch.batchName}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedItem(batch)}
                    className="rounded-full p-5 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-all duration-200 press-scale"
                    aria-label={`Delete ${batch.batchName}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
