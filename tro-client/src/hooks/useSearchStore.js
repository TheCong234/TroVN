import { create } from "zustand";

const useSearchStore = create((set) => ({
  searchHistories: null
}));

export default useSearchStore;
