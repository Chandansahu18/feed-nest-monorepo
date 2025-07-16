import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IUserDataResponse } from "../../../../types/dist";
import type { TUserDataUpdate } from "@/utils/schema/userData";

const handleUserDataUpdate = async (
  updatedData: TUserDataUpdate
): Promise<IUserDataResponse> => {
  try {    
    const response = await FEEDNEST_BACKEND_API.patch("/v1/user", updatedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const useUserDataUpdate = () => {
  const queryClient = useQueryClient();
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: handleUserDataUpdate,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
    },
  });
  return {
    mutate,
    data,
    error,
    isPending,
  };
};
