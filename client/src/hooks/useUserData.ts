import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { IUserDataResponse } from "../../../types/dist/index";

const handleUserData = async (userId?: string): Promise<IUserDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/user", {
      params: { id: userId },
      withCredentials: true,
    });  
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
};
export const useUserData = (userId?: string) => {
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => handleUserData(userId),
    staleTime:30*60*1000,
    gcTime:30*60*1000,
    retry: false,
    refetchOnWindowFocus:false,
    refetchOnMount:false
  });

  return {
    data,
    error,
    isPending,
    isError,
  };
};
