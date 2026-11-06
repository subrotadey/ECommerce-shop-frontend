import axiosInstance from "../utils/axios";

export const getNotifications = async (scope = "me", limit = 20) => {
  const { data } = await axiosInstance.get("/notifications", { params: { scope, limit } });
  return data;
};
export const markNotificationRead = async (id, scope = "me") =>
    (await axiosInstance.patch(`/notifications/${id}/read`, {}, { params: { scope } })).data;
export const markAllNotificationsRead = async (scope = "me") =>
    (await axiosInstance.post("/notifications/read-all", {}, { params: { scope } })).data;