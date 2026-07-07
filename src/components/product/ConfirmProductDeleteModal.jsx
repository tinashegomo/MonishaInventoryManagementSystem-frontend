import { Loader2, X } from "lucide-react";
import Modal from "@/components/shared/Modal";

/**
 * ConfirmProductDeleteModal — confirmation dialog before deleting a product.
 *
 * Uses the shared Modal wrapper which handles <dialog> open/close,
 * backdrop, focus trapping, and ESC close natively.
 */
export default function ConfirmProductDeleteModal({ dialogRef, productName, onConfirm, onCancel, isDeleting }) {
  return (
    <Modal ref={dialogRef} isOpen={true} onClose={onCancel}
      className="mx-16 w-full max-w-sm rounded-panel bg-surface-default p-24 shadow-elevation-4">

      {/* ── Header with close button ─── */}
      <div className="mb-16 flex items-center justify-between">
        <h3 className="text-h4 font-semibold text-text-primary">
          Delete Product
        </h3>
        <button
          onClick={onCancel}
          className="rounded-input p-4 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors press-scale"
        >
          <X className="h-16 w-16" />
        </button>
      </div>

      {/* ── Warning message ─── */}
      <p className="mb-20 text-body-normal text-text-secondary">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-text-primary">{productName}</span>
        ? This cannot be undone.
      </p>

      {/* ── Action Buttons ─── */}
      <div className="flex items-center justify-end gap-12">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 disabled:opacity-50 press-scale"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex items-center gap-8 rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed transition-all duration-200 disabled:opacity-60 press-scale"
        >
          {isDeleting ? ( <> <Loader2 className="h-14 w-14 animate-spin" />Deleting... </> ) : ("Delete")}
        </button>
      </div>

    </Modal>
  );
}
