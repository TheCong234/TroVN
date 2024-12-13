import { UploadV1 } from "@/constants/endpoints";
import { apiClient } from "./apiClient";

export const uploadV1 = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post(UploadV1.UPLOAD_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data;" },
  });
  return data;
};

export const uploadManyV1 = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const { data } = await apiClient.post(UploadV1.UPLOAD_MANY_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data;" },
  });
  return data;
};
