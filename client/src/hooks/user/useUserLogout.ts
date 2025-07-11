import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IGenericMessageResponse } from "../../../types/dist/index";
import { useNavigate } from "react-router-dom";

const handleUserLogout = async (): Promise<IGenericMessageResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post(
      "/v1/user",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const useUserLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleUserLogout,
    retry: false,
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      navigate("/", { replace: true });
    },
  });
};
