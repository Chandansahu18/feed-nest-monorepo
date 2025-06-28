import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import type { TEmailAuth } from "@/utils/schema/userAuth";
import { useMutation } from "@tanstack/react-query";

const handleUserAuth = async (userData: TEmailAuth): Promise<number> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/auth", userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status;
  } catch (error) {
   const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
};

export const useEmailAuth = () => {
  const { data, isError, isPending, mutate } = useMutation({
    mutationKey: ["email-auth"],
    mutationFn: handleUserAuth,
  });

  return {
    data,
    isError,
    isPending,
    mutate,
  };
};
