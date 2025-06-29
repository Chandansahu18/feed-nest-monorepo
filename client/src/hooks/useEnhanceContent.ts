import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { IEnhancedPostDataResponse } from "../../../types/dist";
import type { TEnhancePostData } from "../utils/schema/postsData";

const enhanceContent = async (
  content: TEnhancePostData
): Promise<IEnhancedPostDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/enhance", content, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const useEnhanceContent = () => {
  const { data, error, isPending, mutate } = useMutation({
    mutationKey: ["enhance-post"],
    mutationFn: enhanceContent,
  });

  return {
    data,
    error,
    isPending,
    mutate,
  };
};
