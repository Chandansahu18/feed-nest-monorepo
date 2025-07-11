import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist/index";
import type { TPostDelete } from "@/utils/schema/postsData";

const handlePostDelete = async ({ids}:TPostDelete): Promise<IGenericMessageResponse> => {
  try {
    console.log(ids);
    
    const response = await FEEDNEST_BACKEND_API.delete("/v1/post", {
      data: { ids },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {   
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const usePostDelete = () => {
  const queryClient = useQueryClient();

  const { data, mutate, isError, error, isPending, reset } = useMutation({
    mutationKey: ["post-delete"],
    mutationFn: handlePostDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("Account deletion failed:", error.message);
    },
  });

  return {
    data,
    mutate,
    error,
    isPending,
    isError,
    reset,
  };
};
