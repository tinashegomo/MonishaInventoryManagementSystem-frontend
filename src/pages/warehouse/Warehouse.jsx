import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus,Loader2, Package } from "lucide-react";
import { useGetAllWarehouseBatches, useDeleteWarehouseBatch } from "@/hooks/InventoryHooks";
import {WarehouseBatchList} from "@/components/warehouse/WarehouseBatchList";
import ConfirmBatchDeleteModal from "@/components/warehouse/ConfirmBatchDeleteModal";


function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZW", { day: "numeric", month: "short", year: "numeric" });
}

export default function Warehouse() {

  const { data: batches, isLoading, isError, error } = useGetAllWarehouseBatches();
  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteWarehouseBatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteBatch(selectedItem.batchId, {
      onSuccess: () => setSelectedItem(null),
      onError: () => setSelectedItem(null),
    });
  };

  return (
    <div>
      <div className="mb-24 flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Warehouse Stock</h1>
          <p className="mt-4 text-body-normal text-text-secondary">
            Manage inventory batches
          </p>
        </div>
        <Link
          to="/warehouse/create-batch"
          className="flex items-center gap-8 rounded-input bg-brand-primary px-20 py-12 text-body-normal font-semibold text-neutral-0 hover:bg-brand-hover active:bg-brand-pressed transition-colors duration-200"
        >
          <Plus className="h-16 w-16" />
          Create Batch
        </Link>
      </div>
      
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message || "Failed to load batches. Please try again."}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-12 rounded-card bg-surface-default shadow-elevation-1">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading...</p>
        </div>
      ) : batches && batches.length > 0 ? (
      <WarehouseBatchList batches={batches} setSelectedItem={setSelectedItem}/>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-24 shadow-elevation-1">
          <div className="mb-16 rounded-full bg-surface-muted p-16">
            <Package className="h-32 w-32 text-text-muted" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No batches yet</h3>
        </div>
      )}

      {selectedItem && (
        <ConfirmBatchDeleteModal
          batchName={selectedItem.batchName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setSelectedItem(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
