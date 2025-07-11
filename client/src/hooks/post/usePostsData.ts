import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { IPostsDataResponse } from "../../../types/dist";

const fetchPosts = async (cursor?: string): Promise<IPostsDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/posts", {
      params: { cursor },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostsData = () => {
  const query = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: IPostsDataResponse) => {
      if (!lastPage.success || !lastPage.data?.length) return undefined;
      return lastPage.data[lastPage.data.length - 1].id;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const posts =
    query.data?.pages.flatMap((page: IPostsDataResponse) => page.data ?? []) ??
    [];

  return {
    ...query,
    posts,
    hasMore: query.hasNextPage,
    isLoading: query.isPending,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
