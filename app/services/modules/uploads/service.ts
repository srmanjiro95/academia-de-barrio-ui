import { fetchApi, type ApiResult } from "~/services/api-core";
import { UPLOAD_IMAGE_ENDPOINT } from "~/services/modules/uploads/constants";

export interface UploadImageResponse {
  image_url: string;
  relative_path: string;
}

export const uploadImage = async (
  file: File,
  folder = "general"
): Promise<ApiResult<UploadImageResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  return fetchApi<UploadImageResponse>(
    UPLOAD_IMAGE_ENDPOINT,
    {
      method: "POST",
      body: formData,
    },
    { folder }
  );
};
