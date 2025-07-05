import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import type { TGoogleAuth } from "@/utils/schema/userAuth";
import { useMutation } from "@tanstack/react-query";

const handleGoogleAuth = async (userData: TGoogleAuth): Promise<number> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/auth", userData, {
      params: {
        isAuthWithGoogle: "true",
      },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status;
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(errorMessage);
  }
};

export const useGoogleAuth = () => {
  const { data, isError, error, isPending, mutate } = useMutation({
    mutationKey: ["google-auth"],
    mutationFn: handleGoogleAuth,
  });

  return {
    data,
    error,
    isError,
    isPending,
    mutate,
  };
};
