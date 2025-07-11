import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist";
import type { TPostDataUpdate } from "@/utils/schema/postsData";

const handlePostDataUpdate = async (
  { postId, updatedPostData }: { postId: string; updatedPostData: TPostDataUpdate }
): Promise<IGenericMessageResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.patch(
      '/v1/post/',
      updatedPostData,
      { params:{postId},withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostDataUpdate = () => {
  const { data, isPending, error, mutate } = useMutation({
    mutationKey: ["post-update"],
    mutationFn: handlePostDataUpdate,
    retry: false,
  });

  return {
    data,
    mutate,
    isPending,
    error,
  };
};