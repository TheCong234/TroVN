import { NotificationV1, OrderV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";
import useUserStore from "@/hooks/useUserStore";
import useNotificationStore from "@/hooks/useNotificationStore";

export const getNotificationsByUser = async () => {
  const { page, limit } = useNotificationStore.getState();
  const url = qs.stringifyUrl({
    url: NotificationV1.GET_NOTIFICATIONS_BY_USER,
    query: {
      page,
      limit,
    },
  });
  const { data } = await apiClient.get(url);
  useNotificationStore.setState((prev) => ({
    ...prev,
    notifications: data.data,
  }));
  return data;
};

export const updateNotification = async (id, payload) => {
  const url = qs.stringifyUrl({
    url: NotificationV1.UPDATE_NOTIFICATION + id,
  });
  const { data } = await apiClient.put(url, payload);
  return data;
};

export const deleteNotification = async (id) => {
  const url = qs.stringifyUrl({
    url: NotificationV1.DELETE_NOTIFICATION + id,
  });
  const { data } = await apiClient.delete(url);
  return data;
};

export const getUnReadNotificationCount = async () => {
  const url = qs.stringifyUrl({
    url: NotificationV1.GET_NOTIFICATIONS_UNREAD_BY_USER,
  });
  const { data } = await apiClient.get(url);
  useUserStore.setState(prev => ({
    ...prev,
    unReadNotification: data.data
  }))
  return data;
};
