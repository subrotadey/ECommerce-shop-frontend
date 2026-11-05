// src/services/orderService.js
import axiosInstance from "../utils/axios";

const API_BASE_URL = "/orders";

// সব ফাংশনে একই error হ্যান্ডলিং
const fail = (label, error) => {
  console.error(`${label}:`, error);
  throw error.response?.data || error;
};

// Admin/Staff: সব অর্ডার (page, limit, status, payment, search)
export const getOrders = async (params = {}) => {
  try {
    // খালি ফিল্টার পাঠাই না
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null && v !== "all")
    );
    const { data } = await axiosInstance.get(API_BASE_URL, { params: clean });
    return data;
  } catch (error) {
    fail("Get orders error", error);
  }
};

export const getOrderById = async (orderId) => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/${orderId}`);
    return data;
  } catch (error) {
    fail("Get order error", error);
  }
};

export const getUserOrders = async (userId, params = {}) => {
  try {
    const { data } = await axiosInstance.get(`/users/${userId}/orders`, { params });
    return data;
  } catch (error) {
    fail("Get user orders error", error);
  }
};

// Staff/Admin: স্ট্যাটাস বদল (cancelled দিলে ব্যাকএন্ড stock ফেরত দেয়)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data } = await axiosInstance.patch(
      `${API_BASE_URL}/${orderId}/status`,
      { status }
    );
    return data;
  } catch (error) {
    fail("Update order status error", error);
  }
};

// Staff/Admin: ব্যাংক ট্রান্সফার/COD পেমেন্ট হাতে PAID করা
export const markOrderPaid = async (orderId, { reference = "", note = "", receivedAmount } = {}) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_BASE_URL}/${orderId}/mark-paid`,
      { reference, note, receivedAmount }
    );
    return data;
  } catch (error) {
    fail("Mark paid error", error);
  }
};

// Customer: নিজের pending ও অপরিশোধিত অর্ডার বাতিল
export const cancelMyOrder = async (orderId, reason = "") => {
  try {
    const { data } = await axiosInstance.post(
      `${API_BASE_URL}/${orderId}/cancel`,
      { reason }
    );
    return data;
  } catch (error) {
    fail("Cancel order error", error);
  }
};

// Admin: refund
export const refundOrder = async (orderId, reason) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_BASE_URL}/${orderId}/refund`,
      { reason }
    );
    return data;
  } catch (error) {
    fail("Refund order error", error);
  }
};

export const getOrderStats = async () => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/stats/overview`);
    return data;
  } catch (error) {
    fail("Get order stats error", error);
  }
};

export const exportOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/export/csv`, {
      params,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    fail("Export orders error", error);
  }
};

// একসাথে অনেক অর্ডারের স্ট্যাটাস (প্রতিটির জন্য আলাদা PATCH)
export const batchUpdateOrderStatus = async (orderIds, status) => {
  const results = await Promise.allSettled(
    orderIds.map((id) => updateOrderStatus(id, status))
  );
  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - successful;

  return {
    success: failed === 0,
    message: `Updated ${successful} order(s).${failed ? ` ${failed} failed.` : ""}`,
    successful,
    failed,
  };
};

export const searchOrders = async (searchTerm) => {
  try {
    const { data } = await axiosInstance.get(API_BASE_URL, {
      params: { search: searchTerm, limit: 50 },
    });
    return data;
  } catch (error) {
    fail("Search orders error", error);
  }
};

export default {
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  markOrderPaid,
  cancelMyOrder,
  refundOrder,
  getOrderStats,
  exportOrders,
  batchUpdateOrderStatus,
  searchOrders,
};