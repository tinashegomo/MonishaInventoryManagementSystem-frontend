import { Loader2, X } from "lucide-react";

/**
 * ConfirmProductDeleteModal — confirmation dialog before deleting a product.
 * Shows product name and warns that the action cannot be undone.
 */
export default function ConfirmProductDeleteModal({productName,onConfirm,onCancel,isDeleting}) {
  return (
    // Backdrop overlay with blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1000/40 backdrop-blur-sm">
      <div className="mx-16 w-full max-w-sm rounded-card bg-surface-default p-24 shadow-elevation-4">

        {/* Header with close button */}
        <div className="mb-16 flex items-center justify-between">
          <h3 className="text-h4 font-semibold text-text-primary">
            Delete Product
          </h3>

          <button
            onClick={onCancel}
            className="rounded-input p-4 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
          >
            <X className="h-16 w-16" />
          </button>
        </div>

        {/* Warning message with product name */}
        <p className="mb-20 text-body-normal text-text-secondary">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-text-primary">{productName}</span>
          ? This cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-12">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-input border border-border-default px-20 py-10 text-body-normal font-medium text-text-secondary hover:bg-surface-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-8 rounded-input bg-danger-main px-20 py-10 text-body-normal font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed transition-colors disabled:opacity-60"
          >
            {isDeleting ? ( <> <Loader2 className="h-14 w-14 animate-spin" />Deleting... </> ) : ("Delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
