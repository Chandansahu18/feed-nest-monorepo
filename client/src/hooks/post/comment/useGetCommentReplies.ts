import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { IAllPostCommentsOrRepliesDataResponse } from "../../../../../types/dist";

const fetchCommentReplies = async (commentId:string): Promise<IAllPostCommentsOrRepliesDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/comment", {
      params: { commentId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};
export const useGetCommentReplies = (commentId:string) => {
  const {data, isPending, error} = useQuery({
    queryKey: ["comment-reply-data",commentId],
    queryFn: () => fetchCommentReplies(commentId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    data,
    isPending,
    error
  };
}