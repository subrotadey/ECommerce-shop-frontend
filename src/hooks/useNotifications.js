// src/hooks/usenotifications.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";

export function useNotifications(scope = "me", enabled = true) {
  const qc = useQueryClient();
  const key = ["notifications", scope];

  const query = useQuery({
    queryKey: key,
    queryFn: () => getNotifications(scope),
    enabled,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: key });

  const readOne = useMutation({
    mutationFn: (id) => markNotificationRead(id, scope),
    onSuccess: refresh,
  });
    const readAll = useMutation({
    mutationFn: () => markAllNotificationsRead(scope),
    onSuccess: refresh,
    onError: (err) =>
      console.error("Mark all read failed:", err?.response?.status, err?.response?.data || err.message),
  });

  return {
    notifications: query.data?.notifications || [],
    unreadCount: query.data?.unreadCount || 0,
    isLoading: query.isLoading,
    markRead: readOne.mutate,
    markAllRead: readAll.mutate,
    isMarkingAll: readAll.isPending,
  };
}