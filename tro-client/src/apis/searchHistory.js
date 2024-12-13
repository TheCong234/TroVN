import { apiClient } from "./apiClient";
import qs from "query-string";
import { searchHistoryV1 } from "@/constants/endpoints";
import useSearchStore from "@/hooks/useSearchStore";

export const getSearchHistories = async () => {
  const url = qs.stringifyUrl({
    url: searchHistoryV1.GET_SEARCH_HISTORY,
  });
  const { data } = await apiClient.get(url);
  useSearchStore.setState((prev) => ({
    ...prev,
    searchHistories: data.data,
  }));
  return data;
};

export const deleteSearchHistory = async (id) => {
  const url = qs.stringifyUrl({
    url: searchHistoryV1.DELETE_SEARCH_HISTORY + id,
  });
  return await apiClient.delete(url);
};

export const deleteAllSearchHistory = async () => {
  const url = qs.stringifyUrl({
    url: searchHistoryV1.DELETE_ALL_SEARCH_HISTORY,
  });
  return await apiClient.delete(url);
};
