import { AnalyticsV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";
import useAnalyticsStore from "@/hooks/useAnalyticsStore";

export const getAnalyticsNewListing = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_NEW_LISTING,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getAnalyticsAmountPayment = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_AMOUNT_PAYMENT,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getAnalyticsNewUserRegister = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_NEW_USER_REGISTER,
  });
  const { data } = await apiClient.get(url);
  useAnalyticsStore.setState((prev) => ({
    ...prev,
    newUser: data.data,
  }));
  return data;
};

export const getAnalyticTopUserWithMostListing = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_TOP_10_USER_WITH_MOST_LISTING,
  });
  const { data } = await apiClient.get(url);

  useAnalyticsStore.setState((prev) => ({
    ...prev,
    topUser: data.data,
  }));
  return data;
};

export const getAnalyticLocationCountListing = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_LOCATION_COUNT_LISTING,
  });
  const { data } = await apiClient.get(url);

  useAnalyticsStore.setState((prev) => ({
    ...prev,
    chart: {
      ...prev.chart,
      location: data.data,
    },
  }));
  return data;
};

export const getAnalyticCountAppointment = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_APPOINTMENT_COUNT,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getAnalyticListingActiveAndNonActive = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_ANALYTICS_LISTING_ACTIVE_NONACTIVE_COUNT,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getBalanceInProcess = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_BALANCE_IN_PROCESS,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getInvoiceStatusCount = async () => {
  const url = qs.stringifyUrl({
    url: AnalyticsV1.GET_INVOICE_COUNT_STATUS,
  });
  const { data } = await apiClient.get(url);
  return data;
};
