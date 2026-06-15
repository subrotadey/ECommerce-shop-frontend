// src/hooks/useDashboardStats.js
// Drop-in hook — fetches all 3 dashboard endpoints in parallel
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

// ── individual fetchers ───────────────────────────────────────────────────────

const fetchMainStats = async () => {
  const { data } = await axiosInstance.get("/api/admin/stats/dashboard");
  return data;
};

const fetchRevenueChart = async () => {
  const { data } = await axiosInstance.get("/api/admin/stats/revenue-chart");
  return data;
};

const fetchTopProducts = async () => {
  const { data } = await axiosInstance.get("/api/admin/stats/top-products");
  return data;
};

// ── exported hooks ───────────────────────────────────────────────────────────

/** Main KPI cards + recent orders */
export const useDashboardMainStats = () =>
  useQuery({
    queryKey: ["dashboardMainStats"],
    queryFn: fetchMainStats,
    staleTime: 1000 * 60 * 2,   // re-fetch every 2 min
    retry: 1,
    refetchOnWindowFocus: false,
  });

/** 12-month revenue chart data */
export const useRevenueChart = () =>
  useQuery({
    queryKey: ["revenueChartData"],
    queryFn: fetchRevenueChart,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

/** Top 5 products by revenue */
export const useTopProducts = () =>
  useQuery({
    queryKey: ["topProductsStats"],
    queryFn: fetchTopProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

// ── combined hook (all 3 in one go) ──────────────────────────────────────────

const useDashboardStats = () => {
  const mainQuery     = useDashboardMainStats();
  const chartQuery    = useRevenueChart();
  const productsQuery = useTopProducts();

  return {
    // KPI data
    stats:        mainQuery.data?.stats || null,
    recentOrders: mainQuery.data?.recentOrders || [],

    // Chart data (12 months)
    chartData: chartQuery.data?.chartData || [],

    // Top products
    topProducts: productsQuery.data?.topProducts || [],

    // Loading / error states
    isLoading:
      mainQuery.isLoading || chartQuery.isLoading || productsQuery.isLoading,
    isError:
      mainQuery.isError || chartQuery.isError || productsQuery.isError,

    // Refetch all
    refetch: () => {
      mainQuery.refetch();
      chartQuery.refetch();
      productsQuery.refetch();
    },
  };
};

export default useDashboardStats;