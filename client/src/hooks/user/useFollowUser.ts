import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { IFollowingRelationsDataResponse } from "../../../../types/dist";

const handleFollowingUser = async (userId:string): Promise<IFollowingRelationsDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/user/following", {
        params:{
         followingUserId:userId
        },
      withCredentials: true,
    });      
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
};
export const useUserFollowing = () => {  
  const { data, mutate, error, isPending } = useMutation({
    mutationFn:handleFollowingUser,
    retry: false,
  });

  return {
    data,
    error,
    isPending,
    mutate
  };
};
