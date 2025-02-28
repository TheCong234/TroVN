import axios from "axios";
import { LocationV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const getLocations = async (page, limit, keyword) => {
  const url = qs.stringifyUrl({
    url: LocationV1.GET_LOCATIONS,
    query: {
      page,
      limit,
      keyword,
    },
  });
  // await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  const res = await apiClient.get(url);

  return res.data;
};

export const getLocationByLatLng = async (lat, lon) => {
  const url = qs.stringifyUrl({
    url: import.meta.env.VITE_APP_LOCATION_API,
    query: {
      format: "json",
      lat,
      lon,
      addressdetails: 1,
      "accept-language": "vi",
    },
  });
  const res = await axios.get(url);
  return res.data;
};

export const createLocation = async (location) => {
  const url = qs.stringifyUrl({
    url: LocationV1.CREATE_LOCATION,
  });

  const { data } = await apiClient.post(url, location);
  return data;
};
