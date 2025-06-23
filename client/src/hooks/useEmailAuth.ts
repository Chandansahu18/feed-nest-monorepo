import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import type { TUserAuth } from "@/utils/schema/userAuth";
import { useMutation } from "@tanstack/react-query";

const handleUserAuth = async (userData: TUserAuth): Promise<number> => {
  try {
    const response = await FEEDNEST_BACKEND_API.post("/v1/auth", userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const useEmailAuth = () => {
  const { data, isError, isPending, mutate } = useMutation({
    mutationKey: ["user-auth"],
    mutationFn: handleUserAuth,
  });

  return {
    data,
    isError,
    isPending,
    mutate,
  };
};
