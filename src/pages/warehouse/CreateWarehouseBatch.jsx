import { useNavigate } from "react-router-dom";
import { useCreateWarehouseBatch, useGetAllWarehouseBatches} from "@/hooks/InventoryHooks";
import { WarehouseForm } from "@/components/warehouse/WarehouseForm";

/**
 * CreateWarehouseBatchPage — full-page form for creating a new warehouse batch.
 *
 * Receives RHF data + plain sizes array from WarehouseForm, merges them
 * into a single payload with batchSizes, then sends to backend.
 * On success navigates back to warehouse list.
 */
const CreateWarehouseBatchPage = () => {
  const navigate = useNavigate();

  const { data: warehouseBatches = [] } = useGetAllWarehouseBatches();

  const { mutate: createBatch, isPending: isCreatingBatch } = useCreateWarehouseBatch();

  const handleCreate = (data, sizes) => {

  // Build the request object expected by Spring Boot
  // We combine:
  // 1. React Hook Form data
  // 2. Manual sizes state
  const payload = {...data, batchSizes: sizes};

  // Send everything in ONE request
  // POST /warehouse/create-batch
  createBatch(payload, {

    // Batch + Sizes created successfully
    onSuccess: () => {
      navigate("/warehouse");
    },

    // Handle backend validation or server errors
    onError: (error) => {
      console.error(error.response?.data);
    },
  });
};

  return (
    <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
      <WarehouseForm
        onSubmit={handleCreate}
        isPending={isCreatingBatch}
        batches={warehouseBatches}
      />
    </div>
  );
};

export default CreateWarehouseBatchPage;