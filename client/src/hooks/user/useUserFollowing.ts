import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { IFollowingRelationsDataResponse } from "../../../../types/dist";

const handleGetUserFollowing = async (): Promise<IFollowingRelationsDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/user/following", {
      withCredentials: true,
    });      
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
};
export const useUserFollowing = () => {  
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["user-following"],
    queryFn: handleGetUserFollowing,
    retry: false,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
  });

  return {
    data,
    error,
    isPending,
    isError,
  };
};
