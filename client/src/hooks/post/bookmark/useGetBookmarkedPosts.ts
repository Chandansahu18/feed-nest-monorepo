import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import type { TBookmarkPostProp } from "@/utils/schema/postsData";
import { useQuery } from "@tanstack/react-query";
import type { ISavedPostsDataResponse } from "../../../../../types/dist";

const handleGetBookmarkedPosts = async ({
  postId,
  userId,
}: TBookmarkPostProp):Promise<ISavedPostsDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/user/saved", {
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

export const useGetBookmarkedPosts = ({
  postId,
  userId,
}: TBookmarkPostProp) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["bookmark-post", postId, userId],
    queryFn: () => handleGetBookmarkedPosts({ postId, userId }),
    retry:false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return {
    data,
    isPending,
    error,
  };
};
