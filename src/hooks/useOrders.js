// src/hooks/useOrders.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    batchUpdateOrderStatus,
    cancelMyOrder,
    createAdminOrder,
    createOfflineCustomer,
    exportOrders,
    getOrderById,
    getOrders,
    getOrderStats,
    markOrderPaid,
    refundOrder,
    updateOrderStatus,
} from "../services/orderService";
import notify from "../utils/notification";

// অর্ডার বদলালে এগুলো আবার আনতে হয় (Dashboard-এর সংখ্যাও)
const useRefreshOrders = () => {
  const qc = useQueryClient();
  return (orderId) => {
    qc.invalidateQueries({ queryKey: ["orders"] });
    qc.invalidateQueries({ queryKey: ["orderStats"] });
    qc.invalidateQueries({ queryKey: ["userOrders"] });
    qc.invalidateQueries({ queryKey: ["myOrders"] });
    qc.invalidateQueries({ queryKey: ["admin"] });
    if (orderId) qc.invalidateQueries({ queryKey: ["order", orderId] });
  };
};

const errMsg = (error, fallback) => error?.message || fallback;

export const useOrders = (filters = {}) =>
  useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getOrders(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev, // পেজ বদলালে আগের তালিকা থাকে, ফাঁকা ঝলক নেই
    retry: 1,
  });

export const useOrder = (orderId) =>
  useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60,
    retry: 1,
  });

export const useOrderStats = () =>
  useQuery({
    queryKey: ["orderStats"],
    queryFn: getOrderStats,
    staleTime: 1000 * 60,
    retry: 1,
  });

export const useUpdateOrderStatus = () => {
  const refresh = useRefreshOrders();
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (_d, v) => {
      refresh(v.orderId);
      notify.success("Status Updated", `Order status changed to ${v.status}`);
    },
    onError: (e) => notify.error("Update Failed", errMsg(e, "Failed to update order status")),
  });
};

// নতুন: Mark as Paid
export const useMarkOrderPaid = () => {
  const refresh = useRefreshOrders();
  return useMutation({
    mutationFn: ({ orderId, reference, note, receivedAmount }) =>
      markOrderPaid(orderId, { reference, note, receivedAmount }),
    onSuccess: (_d, v) => {
      refresh(v.orderId);
      notify.success("Payment Recorded", "Order marked as paid");
    },
    onError: (e) => notify.error("Failed", errMsg(e, "Could not mark order as paid")),
  });
};

// নতুন: Customer cancel
export const useCancelMyOrder = () => {
  const refresh = useRefreshOrders();
  return useMutation({
    mutationFn: ({ orderId, reason }) => cancelMyOrder(orderId, reason),
    onSuccess: (_d, v) => {
      refresh(v.orderId);
      notify.success("Order Cancelled", "Your order has been cancelled");
    },
    onError: (e) => notify.error("Cancel Failed", errMsg(e, "Could not cancel order")),
  });
};

export const useRefundOrder = () => {
  const refresh = useRefreshOrders();
  return useMutation({
    mutationFn: ({ orderId, reason }) => refundOrder(orderId, reason),
    onSuccess: (_d, v) => {
      refresh(v.orderId);
      notify.success("Refund Processed", "Order has been refunded successfully");
    },
    onError: (e) => notify.error("Refund Failed", errMsg(e, "Failed to process refund")),
  });
};

export const useExportOrders = () =>
  useMutation({
    mutationFn: exportOrders,
    onSuccess: () => notify.success("Export Successful", "Orders exported successfully"),
    onError: (e) => notify.error("Export Failed", errMsg(e, "Failed to export orders")),
  });

export const useBatchUpdateStatus = () => {
  const refresh = useRefreshOrders();
  return useMutation({
    mutationFn: ({ orderIds, status }) => batchUpdateOrderStatus(orderIds, status),
    onSuccess: (data) => {
      refresh();
      if (data.failed) notify.error("Batch Update", data.message);
      else notify.success("Batch Update Complete", data.message);
    },
    onError: (e) => notify.error("Batch Update Failed", errMsg(e, "Failed to update orders")),
  });
};

// Staff/Admin: ক্রেতার হয়ে অর্ডার (এরর caller দেখায়)
export const useCreateAdminOrder = () => {
  const refresh = useRefreshOrders();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminOrder,
    onSuccess: () => {
      refresh();
      // স্টক বদলেছে, প্রোডাক্ট তালিকা নতুন করে আনতে
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["allProducts"] });
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useCreateOfflineCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOfflineCustomer,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

// Admin Orders পেজের মূল হুক
const useOrderManagement = (filters = {}) => {
  const ordersQuery = useOrders(filters);
  const statsQuery = useOrderStats();
  const updateStatusMutation = useUpdateOrderStatus();
  const markPaidMutation = useMarkOrderPaid();
  const refundMutation = useRefundOrder();
  const exportMutation = useExportOrders();
  const batchUpdateMutation = useBatchUpdateStatus();

  const d = ordersQuery.data;
  // ব্যাকএন্ডের নতুন `pagination` না এলেও পুরোনো ফিল্ড থেকে বানাই
  const pagination = d?.pagination || {
    page: d?.currentPage || 1,
    limit: filters.limit || 10,
    total: d?.total || 0,
    totalPages: d?.totalPages || 1,
  };

  return {
    orders: d?.orders || [],
    pagination,
    stats: statsQuery.data?.stats || {},

    isLoading: ordersQuery.isLoading,
    isFetching: ordersQuery.isFetching,
    isLoadingStats: statsQuery.isLoading,
    isUpdating: updateStatusMutation.isPending,
    isMarkingPaid: markPaidMutation.isPending,
    isRefunding: refundMutation.isPending,
    isExporting: exportMutation.isPending,
    isBatchUpdating: batchUpdateMutation.isPending,

    error: ordersQuery.error,
    statsError: statsQuery.error,

    updateStatus: (orderId, status) =>
      updateStatusMutation.mutate({ orderId, status }),
    // await করা যায় (dialog বন্ধ করার আগে ফল জানতে)
    markPaid: (orderId, payload) =>
      markPaidMutation.mutateAsync({ orderId, ...payload }),
    refundOrder: (orderId, reason) =>
      refundMutation.mutate({ orderId, reason }),
    exportOrders: exportMutation.mutate,
    batchUpdateStatus: (orderIds, status) =>
      batchUpdateMutation.mutate({ orderIds, status }),

    refetch: ordersQuery.refetch,
    refetchStats: statsQuery.refetch,
  };
};

export default useOrderManagement;