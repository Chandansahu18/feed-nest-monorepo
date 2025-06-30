import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { IPostDataResponse } from "../../../types/dist";

const fetchPost = async (postId: string): Promise<IPostDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/post", {
      params: { postId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostData = (postId:string) => {
  const {data, isPending, error} = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchPost(postId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    data,
    isPending,
    error
  };
};
