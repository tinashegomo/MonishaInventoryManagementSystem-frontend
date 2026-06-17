import { Trash2 } from "lucide-react";

// Format ISO date string to readable format
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZW", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * ProductList — table displaying all products with their details.
 * Each row shows batch, school, type/variant/color, quantities, prices, and sizes.
 */
export const ProductList = ({ products, setSelectedItem }) => {
  return (
    <div className="rounded-card bg-surface-default shadow-elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-muted">
              <th className="px-24 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Product Name</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Batch</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">School</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Type</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Variant</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Color</th>
              <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Total Qty</th>
              <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Price</th>
              <th className="px-16 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Total Price</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Sizes</th>
              <th className="px-16 py-14 text-left text-ui-label font-semibold text-text-secondary whitespace-nowrap">Created</th>
              <th className="px-24 py-14 text-right text-ui-label font-semibold text-text-secondary whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.productId}
                className="border-b border-border-default last:border-b-0 hover:bg-surface-muted/50 transition-colors"
              >
                <td className="px-24 py-16 text-body-normal font-medium text-text-primary whitespace-nowrap">
                  {product.productName}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                  {product.batchName || "-"}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-muted whitespace-nowrap">
                  {product.schoolName || "-"}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                  {product.type || "-"}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                  {product.variant || "-"}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-primary whitespace-nowrap">
                  {product.color || "-"}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-primary text-right whitespace-nowrap tabular-nums">
                  {product.totalQuantity}
                </td>
                <td className="px-16 py-16 text-body-normal text-text-primary text-right whitespace-nowrap tabular-nums">
                  ${product.productPrice?.toLocaleString()}
                </td>
                <td className="px-16 py-16 text-body-normal font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                  ${product.totalPrice?.toLocaleString()}
                </td>
                {/* Size:quantity pairs — e.g. "32:50, 34:30" */}
                <td className="px-16 py-16 text-body-small text-text-muted whitespace-nowrap">
                  {product.productSizes
                    ?.map((s) => `${s.size}:${s.quantity}`)
                    .join(", ") || "-"}
                </td>
                <td className="px-16 py-16 text-body-small text-text-muted whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-24 py-16 text-right whitespace-nowrap">
                  <button
                    onClick={() => setSelectedItem(product)}
                    className="rounded-input p-8 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-colors"
                    aria-label={`Delete ${product.productName}`}
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
