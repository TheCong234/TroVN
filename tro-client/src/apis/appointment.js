import { apiClient } from "./apiClient";
import { appointmentsV1 } from "@/constants/endpoints";
import qs from "query-string";

export const createAppointment = async (data) => {
  const url = qs.stringifyUrl({
    url: appointmentsV1.CREATE_APPOINTMENT,
  });
  return await apiClient.post(url, data);
};

export const getAllAppointments = async (
  page = 1,
  limit = 20,
  fromDate = undefined,
  toDate = undefined
) => {
  const url = qs.stringifyUrl({
    url: appointmentsV1.GET_ALL_APPOINTMENT,
    query: {
      page,
      limit,
      fromDate,
      toDate,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getAppointmentsByHost = async (
  page = 1,
  limit = 20,
  fromDate = undefined,
  toDate = undefined,
  status = undefined
) => {
  const url = qs.stringifyUrl({
    url: appointmentsV1.GET_ALL_APPOINTMENT_FOR_HOST,
    query: {
      page,
      limit,
      fromDate,
      toDate,
      status,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const updateAppointmentsByHost = async (id, value) => {
  const url = qs.stringifyUrl({
    url: appointmentsV1.UPDATE_APPOINTMENT + id,
  });
  const { data } = await apiClient.put(url, value);
  return data;
};
