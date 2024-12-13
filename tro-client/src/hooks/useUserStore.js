import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  token: JSON.parse(localStorage.getItem("token")) || "",
  adsPackage: null,
  otp: "",
  socketConnection: null,
  balance: 0,
  onlineUser: [],
  buyPackage: {
    id: null,
    amount: null,
    orderInfo: null,
    packageType: null,
  },
  unReadNotification: null,

  setBuyPackage: (data) => {
    set((state) => ({
      ...state,
      buyPackage: data,
    }));
  },

  setPackageId: (data) => {
    set((state) => ({
      ...state,
      packageId: data,
    }));
  },

  setUser: (data) => {
    set((state) => ({ ...state, user: data }));
  },

  setOtp: (data) => {
    set((state) => ({ ...state, otp: data }));
  },

  setToken: (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    set((state) => ({ ...state, token: data }));
  },

  setSocketConnection: (data) => {
    set((state) => ({
      ...state,
      socketConnection: data,
    }));
  },
  setOnlineUser: (data) => {
    set((state) => ({
      ...state,
      onlineUser: data,
    }));
  },

  removeToken: () => {
    set((state) => ({
      ...state,
      token: "",
    }));
  },

  setPackageType: (data) => {
    set((state) => ({
      ...state,
      buyPackage: {
        ...state.buyPackage,
        packageType: data,
      },
    }));
  },
}));

export default useUserStore;
