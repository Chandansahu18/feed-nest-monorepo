import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist/index";

const handlePostDelete = async (
  postId: string
): Promise<IGenericMessageResponse> => {
  const response = await FEEDNEST_BACKEND_API.delete("/v1/post", {
    data: { ids: postId },
    withCredentials: true,
  });
  return response.data;
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
