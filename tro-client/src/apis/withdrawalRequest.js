import { WithdrawalRequestV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const createWithdrawalRequest = async (payload) => {
  const url = qs.stringifyUrl({
    url: WithdrawalRequestV1.CREATE_WITHDRAWAL_REQUEST,
  });
  const { data } = await apiClient.post(url, payload);
  return data;
};

export const getWithdrawalRequestByUser = async (page, limit) => {
  const url = qs.stringifyUrl({
    url: WithdrawalRequestV1.GET_WITHDRAWAL_REQUEST_BY_USER,
    query: {
      page,
      limit,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getWithdrawalRequests = async (page, limit) => {
  const url = qs.stringifyUrl({
    url: WithdrawalRequestV1.GET_WITHDRAWAL_REQUEST,
    query: {
      page,
      limit,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const updateWithdrawalRequest = async (id, payload) => {
  const url = qs.stringifyUrl({
    url: WithdrawalRequestV1.UPDATE_WITHDRAWAL_REQUEST + id,
  });
  const { data } = await apiClient.put(url, payload);
  return data;
};

export const deleteWithdrawalRequest = async (id) => {
  const url = qs.stringifyUrl({
    url: WithdrawalRequestV1.DELETE_WITHDRAWAL_REQUEST + id,
  });
  const { data } = await apiClient.delete(url);
  return data;
};
