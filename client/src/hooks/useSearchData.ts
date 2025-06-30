import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { ISearchDataResponse } from "../../../types/dist/index";

const handleSearchData = async (searchedTerm: string): Promise<ISearchDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get("/v1/search", {
      params: { searchedTerm },
      withCredentials: true,
    });  
    return response.data;
  } catch (error) {   
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
};
export const useSearchData = (searchedTerm: string) => {
  const { data, error, isPending } = useQuery({
    queryKey: ["search",searchedTerm],
    queryFn: () => handleSearchData(searchedTerm),
    retry: false,
    refetchOnWindowFocus:false,
    refetchOnMount:false
  });

  return {
    data,
    error,
    isPending,
  };
};
