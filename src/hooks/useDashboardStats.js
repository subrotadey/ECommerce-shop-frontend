// src/hooks/useDashboardStats.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

const get = (url) => async () => (await axiosInstance.get(url)).data;

export const useDashboardMainStats = () =>
  useQuery({
    queryKey: ["dashboardMainStats"],
    queryFn: get("/admin/stats/dashboard"),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useRevenueChart = () =>
  useQuery({
    queryKey: ["revenueChartData"],
    queryFn: get("/admin/stats/revenue-chart"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useTopProducts = () =>
  useQuery({
    queryKey: ["topProductsStats"],
    queryFn: get("/admin/stats/top-products"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useTopCustomers = () =>
  useQuery({
    queryKey: ["topCustomersStats"],
    queryFn: get("/admin/stats/top-customers"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

const useDashboardStats = () => {
  const main = useDashboardMainStats();
  const chart = useRevenueChart();
  const products = useTopProducts();
  const customers = useTopCustomers();

  return {
    stats: main.data?.stats || null,
    recentOrders: main.data?.recentOrders || [],
    chartData: chart.data?.chartData || [],
    topProducts: products.data?.topProducts || [],
    topCustomers: customers.data?.topCustomers || [],

    isLoading: main.isLoading || chart.isLoading || products.isLoading || customers.isLoading,
    isFetching: main.isFetching || chart.isFetching || products.isFetching || customers.isFetching,
    // মূল কার্ড ব্যর্থ হলেই পুরো পেজ ত্রুটি দেখাবে; বাকিগুলো ফাঁকা দেখাবে
    isError: main.isError,

    refetch: () =>
      Promise.all([main.refetch(), chart.refetch(), products.refetch(), customers.refetch()]),
  };
};

export default useDashboardStats;