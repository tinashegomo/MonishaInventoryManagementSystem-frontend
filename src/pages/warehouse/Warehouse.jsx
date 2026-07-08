import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, Package, FileSpreadsheet, FileText } from "lucide-react";
import { useGetAllWarehouseBatches, useDeleteWarehouseBatch, useGetCurrentUser } from "@/hooks/InventoryHooks";
import { WarehouseBatchList } from "@/components/warehouse/WarehouseBatchList";
import Modal from "@/components/shared/Modal";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

const BATCH_COLUMNS = [
  { header: "Batch Name", key: "batchName" },
  { header: "Type", key: "type" },
  { header: "Variant", key: "variant" },
  { header: "Color", key: "color" },
  { header: "Quantity", key: "totalQuantity" },
  { header: "Price", key: "batchPrice" },
  { header: "Created", key: "createdAt" },
  { header: "Created By", key: "createdBy" },
];

export default function Warehouse() {
  const { data: user } = useGetCurrentUser();
  const { data: batches, isLoading, isError, error } = useGetAllWarehouseBatches();
  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteWarehouseBatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const sortedBatches = useMemo(() => {
    if (!batches) return [];
    return [...batches].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [batches]);

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteBatch(selectedItem.batchId, {
      onSuccess: () => setSelectedItem(null),
      onError: () => setSelectedItem(null),
    });
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Warehouse Stock</h1>
          <p className="mt-8 text-body-normal text-text-secondary">Manage inventory batches</p>
        </div>
        <div className="flex items-center gap-8">
          {sortedBatches.length > 0 && (
            <>
              <button
                onClick={() => exportToExcel(sortedBatches, BATCH_COLUMNS, "warehouse-batches")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileSpreadsheet className="h-16 w-16" />
                Excel
              </button>
              <button
                onClick={() => exportToPDF(sortedBatches, BATCH_COLUMNS, "Warehouse Batches", "warehouse-batches")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileText className="h-16 w-16" />
                PDF
              </button>
            </>
          )}
          {user?.userRole !== "USER" && (
            <Link
              to="/warehouse/create-batch"
              className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
            >
              <Plus className="h-16 w-16" />
              Create Batch
            </Link>
          )}
        </div>
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load batches. Please try again."}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading batches...</p>
        </div>
      ) : sortedBatches.length > 0 ? (
        <WarehouseBatchList batches={sortedBatches} setSelectedItem={setSelectedItem} />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Package className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No batches yet</h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by creating your first warehouse batch.
          </p>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─── */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>

        <Modal.Header onClose={() => setSelectedItem(null)}>
          Delete Batch
        </Modal.Header>

        <Modal.Body>
          <p className="text-body-normal text-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">{selectedItem?.batchName}</span>
            ? This cannot be undone.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setSelectedItem(null); }}
            disabled={isDeleting}
            className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 disabled:opacity-50 press-scale"
          >
            Cancel
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleDeleteConfirm(); }}
            disabled={isDeleting}
            className="flex items-center gap-8 rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed transition-all duration-200 disabled:opacity-60 press-scale"
          >
            {isDeleting ? (<><Loader2 className="h-14 w-14 animate-spin" /> Deleting...</>) : ("Delete")}
          </button>
        </Modal.Footer>

      </Modal>
    </div>
  );
}
