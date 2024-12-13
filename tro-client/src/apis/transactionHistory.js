import { TagV1, TransactionHistoryV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const createTransactionHistory = async (payload) => {
  const url = qs.stringifyUrl({
    url: TransactionHistoryV1.CREATE_TRANSACTION_HISTORY,
  });
  const { data } = await apiClient.post(url, payload);
  return data;
};

export const getTransactionByUser = async (page, limit) => {
  const url = qs.stringifyUrl({
    url: TransactionHistoryV1.GET_TRANSACTION_HISTORY_BY_USER,
    query: {
      page,
      limit,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};
