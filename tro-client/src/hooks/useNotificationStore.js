import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  page: 1,
  limit: 10,
  updateNotifications: (data) =>
    set((state) => ({
      ...state,
      notifications: {
        contents: [data, ...(state.notifications.contents || [])],
        totalElement: state.notifications.totalElement + 1,
        unReadCount: state.notifications.unReadCount + 1,
      },
    })),
}));

export default useNotificationStore;
