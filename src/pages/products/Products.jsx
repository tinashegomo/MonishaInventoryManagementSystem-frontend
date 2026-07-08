import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, Package, FileSpreadsheet, FileText } from "lucide-react";
import { useGetAllProducts, useDeleteProduct, useGetCurrentUser } from "@/hooks/InventoryHooks";
import { ProductList } from "@/components/product/ProductList";
import Modal from "@/components/shared/Modal";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

const PRODUCT_COLUMNS = [
  { header: "Product Name", key: "productName" },
  { header: "Batch", key: "batchName" },
  { header: "School", key: "schoolName" },
  { header: "Type", key: "type" },
  { header: "Variant", key: "variant" },
  { header: "Color", key: "color" },
  { header: "Quantity", key: "totalQuantity" },
  { header: "Price", key: "productPrice" },
  { header: "Total", key: "totalPrice" },
  { header: "Created", key: "createdAt" },
  { header: "Created By", key: "createdBy" },
];

export default function Products() {
  const { data: user } = useGetCurrentUser();
  const { data: products, isLoading, isError, error } = useGetAllProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [selectedItem, setSelectedItem] = useState(null);

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products]);

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteProduct(selectedItem.productId, {
      onSuccess: () => setSelectedItem(null),
      onError: () => setSelectedItem(null),
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Products Allocation</h1>
          <p className="mt-8 text-body-normal text-text-secondary">Manage product allocations</p>
        </div>
        <div className="flex items-center gap-8">
          {sortedProducts.length > 0 && (
            <>
              <button
                onClick={() => exportToExcel(sortedProducts, PRODUCT_COLUMNS, "products")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileSpreadsheet className="h-16 w-16" />
                Excel
              </button>
              <button
                onClick={() => exportToPDF(sortedProducts, PRODUCT_COLUMNS, "Products Allocation", "products")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileText className="h-16 w-16" />
                PDF
              </button>
            </>
          )}
          {user?.userRole !== "USER" && (
            <Link
              to="/products/create-product"
              className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
            >
              <Plus className="h-16 w-16" />
              Create Product
            </Link>
          )}
        </div>
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load products. Please try again."}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading products...</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <ProductList
          products={sortedProducts}
          setSelectedItem={setSelectedItem}
        />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Package className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No products yet</h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by creating your first product allocation.
          </p>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─── */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>

        <Modal.Header onClose={() => setSelectedItem(null)}>
          Delete Product
        </Modal.Header>

        <Modal.Body>
          <p className="text-body-normal text-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">{selectedItem?.productName}</span>
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
            {isDeleting ? (<> <Loader2 className="h-14 w-14 animate-spin" />Deleting... </>) : ("Delete")}
          </button>
        </Modal.Footer>

      </Modal>
    </div>
  );
}
