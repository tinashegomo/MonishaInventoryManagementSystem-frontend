import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useCreateWarehouseBatch,
  useGetAllWarehouseBatches,
} from "@/hooks/InventoryHooks";
import { WarehouseForm } from "@/components/warehouse/WarehouseForm";

export default function CreateWarehouseBatch() {
  const navigate = useNavigate();

  const { data: existingBatches } = useGetAllWarehouseBatches();
  const {
    mutate: createBatch,
    isPending,
    isError,
    error,
  } = useCreateWarehouseBatch();

  const handleCreate = (WarehouseBatchRequestDTO) => {
    createBatch(WarehouseBatchRequestDTO, {
      onSuccess: () => {
        navigate("/warehouse");
      },
      onError: (err) => {
        console.error(err.response?.data);
      },
    });
  };

  const batches = existingBatches || [];

  return (
    <div>
      <Link
        to="/warehouse"
        className="mb-16 inline-flex items-center gap-8 text-body-normal font-medium text-brand-primary hover:text-brand-hover transition-colors duration-200"
      >
        <ArrowLeft className="h-16 w-16" />
        Back to Warehouse
      </Link>

      <div className="mb-24">
        <h1 className="text-h2 font-bold text-text-primary">Create Batch</h1>
        <p className="mt-4 text-body-normal text-text-secondary">
          Add a new stock batch to the warehouse
        </p>
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message || "Failed to create batch. Please try again."}
        </div>
      )}

      <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
        <WarehouseForm
          onSubmit={handleCreate}
          isPending={isPending}
          existingBatches={batches}
        />
      </div>
    </div>
  );
}
