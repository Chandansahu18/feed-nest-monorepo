import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist/index";

const handlePostLikes = async (postId:string): Promise<IGenericMessageResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/post/like", {},{
        params:{postId},
      withCredentials: true,
    });      
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
};
export const usePostLikes = () => {  
  const { data,mutate, isError, error, isPending } = useMutation({
    mutationKey: ["post-likes"],
    mutationFn: handlePostLikes,
    retry: false,
  });

  return {
    data,
    mutate,
    error,
    isPending,
    isError,
  };
};
