import { BlogV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";
import qs from "query-string";

export const createBlogPost = async (payload) => {
  const url = qs.stringifyUrl({
    url: BlogV1.CREATE_BLOG,
  });
  const { data } = await apiClient.post(url, payload);
  return data;
};

export const getBlogs = async (
  page = 1,
  limit = 10,
  keyword = undefined,
  tag = undefined
) => {
  const url = qs.stringifyUrl({
    url: BlogV1.GET_BLOG,
    query: {
      page,
      limit,
      keyword,
      tag,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const getDetailBlog = async (slug) => {
  const url = qs.stringifyUrl({
    url: BlogV1.GET_DETAIL_BLOG + slug,
  });
  const { data } = await apiClient.get(url);
  return data;
};
