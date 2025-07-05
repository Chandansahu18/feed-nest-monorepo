import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist/index";

const handleUserAccountDelete = async (): Promise<IGenericMessageResponse> => {
  const response = await FEEDNEST_BACKEND_API.delete("/v1/user", {
    withCredentials: true,
  });
  return response.data;
};

export const useUserAccountDelete = () => {
  const queryClient = useQueryClient();

  const { data, mutate, isError, error, isPending, reset } = useMutation({
    mutationKey: ["account-delete"],
    mutationFn: handleUserAccountDelete,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.removeQueries({
        predicate: () => true,
      });
    },
    onError: (error: Error) => {
      console.error("Account deletion failed:", error.message);
    },
  });

  return {
    data,
    mutate,
    error: error as Error,
    isPending,
    isError,
    reset,
  };
};
