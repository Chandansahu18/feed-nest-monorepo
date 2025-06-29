import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IPostCreatedDataResponse } from "../../../types/dist";
import type { TCreatePostData } from "@/utils/schema/postsData";

const createPost = async (
  postData: TCreatePostData
): Promise<IPostCreatedDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/post", postData, {
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

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
