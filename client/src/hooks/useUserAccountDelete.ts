import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist/index";

const handleUserAccountDelete = async (): Promise<IGenericMessageResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.delete("/v1/user", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const useUserAccountDelete = () => {
  const queryClient = useQueryClient();

  const { data, mutate, error, isPending } = useMutation({
    mutationKey: ["account-delete"],
    mutationFn: handleUserAccountDelete,
    onSuccess: async () => {
      queryClient.clear();
      await queryClient.invalidateQueries({
        queryKey: ["user-data"],
      });
    },
  });

  return {
    data,
    mutate,
    error,
    isPending,
  };
};
