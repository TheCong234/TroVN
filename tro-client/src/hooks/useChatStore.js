import { create } from "zustand";

const useChatStore = create((set) => ({
  currentConversation: null,

  setCurrentConversation: (currentConversation) => {
    set((state) => ({
      ...state,
      currentConversation,
    }));
  },

  addNewMessage: (message) =>
    set((state) => ({
      ...state,
      currentConversation: {
        ...state.currentConversation,
        messages: [...state.currentConversation.messages, message],
      },
    })),
}));

export default useChatStore;
