import { RentedRoomV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";
import { get } from "lodash";

export const getRentedRoomByHost = async (page, limit, status = undefined) => {
  const url = qs.stringifyUrl({
    url: RentedRoomV1.GET_ALL_RENTED_ROOM_BY_HOST,
    query: {
      page,
      limit,
      status,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

/**
 * Fetches a list of rented rooms for a user from the API.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Object>} The data returned from the API containing rented room details.
 * @throws Will throw an error if the request fails.
 */
export const getRentedRoomByUser = async (page, limit) => {
  const url = qs.stringifyUrl({
    url: RentedRoomV1.GET_ALL_RENTED_ROOM_BY_USER,
    query: {
      page,
      limit,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const updateRentedRoom = async (id, body) => {
  const url = qs.stringifyUrl({
    url: RentedRoomV1.UPDATE_RENTED_ROOM + id,
  });
  const { data } = await apiClient.put(url, body);
  return data;
};

export const getRentedRoomById = async (id) => {
  const url = qs.stringifyUrl({
    url: RentedRoomV1.GET_RENTED_ROOM_BY_ID + id,
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const deleteRentedRoom = async (id) => {
  const url = qs.stringifyUrl({
    url: RentedRoomV1.DELETE_RENTED_ROOM + id,
  });
  const { data } = await apiClient.delete(url);
  return data;
};
