import { useGetCurrentUser, useGetAllOrders, useGetAllProducts, useGetAllWarehouseBatches } from "@/hooks/InventoryHooks";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { HeroStats, SecondaryStats, OrdersTrend, StatusAndStock, RevenueSchoolProducts } from "@/components/dashboard/DashboardCharts";
import { InfoPanels } from "@/components/dashboard/DashboardInfoPanels";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { FileSpreadsheet, FileText } from "lucide-react";

const ORDER_COLUMNS = [
  { header: "Order #", key: "orderNumber" },
  { header: "Customer", key: "customerName" },
  { header: "Status", key: "orderStatus" },
  { header: "Total", key: "totalAmount" },
  { header: "Paid", key: "paidAmount" },
  { header: "Date", key: "createdAt" },
];

/**
 * Dashboard page — serves as the home screen of Monisha IMS.
 * Displays aggregate KPI stats, charts (Recharts), and alert panels.
 * Delegates all calculation complexity to the useDashboardStats custom hook.
 */
export default function Dashboard() {
  // ─── Data Queries ──────────────────────────────────────────────
  const { data: user } = useGetCurrentUser();
  const { data: orders = [] } = useGetAllOrders();
  const { data: products = [] } = useGetAllProducts();
  const { data: batches = [] } = useGetAllWarehouseBatches();

  // ─── Computations Hook ──────────────────────────────────────────
  // Compute all aggregates, charts data, and low-stock/upcoming alerts
  const dashboard = useDashboardStats({ orders, products, batches });

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="animate-fade-in">
        {/* ── Welcome Banner ── */}
        <div className="mb-40 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.userName || "there"}</h1>
            <p className="mt-8 text-sm text-gray-500">Here&apos;s what&apos;s happening in your inventory today.</p>
          </div>
          {orders.length > 0 && (
            <div className="flex items-center gap-8">
              <button
                onClick={() => exportToExcel(orders, ORDER_COLUMNS, "orders")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileSpreadsheet className="h-16 w-16" />
                Orders Excel
              </button>
              <button
                onClick={() => exportToPDF(orders, ORDER_COLUMNS, "Orders", "orders")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileText className="h-16 w-16" />
                Orders PDF
              </button>
            </div>
          )}
        </div>

        {/* ── KPI Stat Cards ── */}
        <HeroStats stats={dashboard.stats} />
        <SecondaryStats stats={dashboard.stats} />

        {/* ── Line Chart: Weekly Trend ── */}
        <OrdersTrend trendData={dashboard.trendData} />

        {/* ── Donut & Progress Charts: Status & Types ── */}
        <StatusAndStock 
          statusData={dashboard.statusData} 
          totalOrders={dashboard.totalOrders} 
          stockByType={dashboard.stockByType} 
          totalStock={dashboard.totalStock} 
        />

        {/* ── Column & Donut Charts: Revenue, School Vs Shop, Best Sellers ── */}
        <RevenueSchoolProducts 
          stats={dashboard.stats} 
          orders={orders} 
          schoolVsShopData={dashboard.schoolVsShopData} 
          topProducts={dashboard.topProducts} 
          collectionPercentage={dashboard.collectionPercentage} 
        />

        {/* ── Info Panels: Alerts & Reminders ── */}
        <InfoPanels 
          upcomingCollections={dashboard.upcomingCollections} 
          lowStockProducts={dashboard.lowStockProducts} 
        />
      </div>
    </div>
  );
}
