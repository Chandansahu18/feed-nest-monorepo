import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { IAllPostCommentsOrRepliesDataResponse } from "../../../types/dist";

const fetchPostComments = async (postId?: string,commentId?:string): Promise<IAllPostCommentsOrRepliesDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/comment", {
      params: { postId,commentId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostCommentsData = (postId?:string,commentId?:string) => {
  const {data, isPending, error} = useQuery({
    queryKey: ["post-comment",postId,commentId],
    queryFn: () => fetchPostComments(postId,commentId),
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
