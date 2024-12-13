import { AmenityV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const getAllAmenity = async () => {
  const url = qs.stringifyUrl({
    url: AmenityV1.GET_ALL_AMENITY,
  });
  const res = await apiClient.get(url);
  return res.data;
};

export const createAmenity = async (data) =>{
  const url = qs.stringifyUrl({
    url: AmenityV1.CREATE_AMENITY,
  });
  const res = await apiClient.post(url, data);
  return res.data;
}

export const deleteAmenityById =  async (id) =>{
  const url = qs.stringifyUrl({
    url: AmenityV1.REMOVE_AMENITY + id,
  });
  const res = await apiClient.delete(url)
  return res;
}
