import { PaymentInfoV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const createPaymentInfo = async (payload) => {
  const url = qs.stringifyUrl({
    url: PaymentInfoV1.CREATE_PAYMENT_INFO,
  });
  const { data } = await apiClient.post(url, payload);
  return data;
};

export const getPaymentInfoByUser = async () => {
  const url = qs.stringifyUrl({
    url: PaymentInfoV1.GET_PAYMENT_INFO_BY_USER,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getPaymentInfoById = async (id) => {
  const url = qs.stringifyUrl({
    url: PaymentInfoV1.GET_PAYMENT_INFO + id,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const updatePaymentInfo = async (id, payload) => {
  const url = qs.stringifyUrl({
    url: PaymentInfoV1.UPDATE_PAYMENT_INFO + id,
  });
  const { data } = await apiClient.put(url, payload);
  return data;
};

export const deletePaymentInfo = async (id) => {
  const url = qs.stringifyUrl({
    url: PaymentInfoV1.DELETE_PAYMENT_INFO + id,
  });
  const { data } = await apiClient.delete(url);
  return data;
};
