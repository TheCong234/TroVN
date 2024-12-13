import { InvoiceV1, TagV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const createInvoice = async (payload) => {
  const url = qs.stringifyUrl({
    url: InvoiceV1.CREATE_INVOICE,
  });
  const { data } = await apiClient.post(url, payload);
  return data;
};

export const getInvoiceByHost = async (page, limit, isPayment) => {
  const url = qs.stringifyUrl({
    url: InvoiceV1.GET_ALL_INVOICE_BY_HOST,
    query: {
      page,
      limit,
      isPayment,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getInvoiceByUser = async (page, limit) => {
  const url = qs.stringifyUrl({
    url: InvoiceV1.GET_ALL_INVOICE_BY_USER,
    query: {
      page,
      limit,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};
