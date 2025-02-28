import { create } from "zustand";
import useUserStore from "./useUserStore";

const useConversationStore = create((set) => ({
  conversations: [],
  unreadMessagesCount: 0,
  currentConversation: null,

  setCurrentConversation: (conversation) =>
    set((state) => ({
      ...state,
      currentConversation: conversation,
    })),

  setConversations: (data) => {
    set((state) => {
      const conversationUserData = data?.map((conversationUser) => {
        if (conversationUser?.sender?.id === conversationUser?.receiver?.id) {
          return {
            ...conversationUser,
            userDetails: conversationUser?.sender,
          };
        } else if (
          conversationUser?.receiver?.id !== useUserStore.getState().user?.id
        ) {
          return {
            ...conversationUser,
            userDetails: conversationUser.receiver,
          };
        } else {
          return {
            ...conversationUser,
            userDetails: conversationUser.sender,
          };
        }
      });
      return {
        ...state,
        conversations: conversationUserData,
      };
    });
  },

  setUnreadMessagesCount: (data) => {
    set((state) => ({
      ...state,
      unreadMessagesCount: data,
    }));
  },
}));

export default useConversationStore;
