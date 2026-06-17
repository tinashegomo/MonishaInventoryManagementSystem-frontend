import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, Package } from "lucide-react";
import { useGetAllProducts, useDeleteProduct,} from "@/hooks/InventoryHooks";
import { ProductList } from "@/components/product/ProductList";
import ConfirmProductDeleteModal from "@/components/product/ConfirmProductDeleteModal";

/**
 * Products — list page for all allocated products.
 * Shows loading spinner, empty state, error banner, or product table.
 * Delete triggers a confirmation modal before removing.
 */
export default function Products() {
  const { data: products,isLoading,isError,error } = useGetAllProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [selectedItem, setSelectedItem] = useState(null);

  // Delete selected product, close modal on success or error
  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteProduct(selectedItem.productId, {
      onSuccess: () => setSelectedItem(null),
      onError: () => setSelectedItem(null),
    });
  };

  return (
    <div>
      <div className="mb-24 flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">
            Products Allocation
          </h1>
          <p className="mt-4 text-body-normal text-text-secondary">
            Manage product allocations
          </p>
        </div>
        <Link
          to="/products/create-product"
          className="flex items-center gap-8 rounded-input bg-brand-primary px-20 py-12 text-body-normal font-semibold text-neutral-0 hover:bg-brand-hover active:bg-brand-pressed transition-colors duration-200"
        >
          <Plus className="h-16 w-16" />
          Create Product
        </Link>
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message ||
            "Failed to load products. Please try again."}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-12 rounded-card bg-surface-default shadow-elevation-1">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading...</p>
        </div>
      ) : products && products.length > 0 ? (
        <ProductList
          products={products}
          setSelectedItem={setSelectedItem}
        />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-24 shadow-elevation-1">
          <div className="mb-16 rounded-full bg-surface-muted p-16">
            <Package className="h-32 w-32 text-text-muted" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">
            No products yet
          </h3>
        </div>
      )}

      {selectedItem && (
        <ConfirmProductDeleteModal
          productName={selectedItem.productName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setSelectedItem(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
