import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { IPostCommentOrReplyDataResponse } from "../../../../../types/dist";
import type { TPostComment } from "@/utils/schema/postsData";

const handlePostComment = async ({postId,commentId,comment}:TPostComment): Promise<IPostCommentOrReplyDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/comment",{
      postId,
      commentId,
      comment
    },{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostComment = () => {
  const {data, mutate,isPending, error} = useMutation({
    mutationKey: ["post-comment"],
    mutationFn: handlePostComment,
    retry: false
  });
  return{
    data,
    mutate,
    isPending,
    error
  }
}

