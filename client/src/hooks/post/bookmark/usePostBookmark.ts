import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ISavedPostsDataResponse } from "../../../../../types/dist";
import type { TBookmarkPostProp } from "@/utils/schema/postsData";

const handlePostBookmark = async ({
  postId,
  userId,
}: TBookmarkPostProp): Promise<ISavedPostsDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/user/saved", null, {
      params: {
        postId,
        userId,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostBookmark = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["bookmark-post"],
    mutationFn: ({ postId, userId }: TBookmarkPostProp) =>
      handlePostBookmark({ postId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    mutate,
  };
};
