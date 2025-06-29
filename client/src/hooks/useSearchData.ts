import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { ISearchDataResponse } from "../../../types/dist";

const handleSearch = async (searchTerm: string): Promise<ISearchDataResponse> => {
  try {
    const response = await FEEDNEST_BACKEND_API.get('/v1/search', {
      params: { searchedTerm: searchTerm },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    throw new Error(errorMessage);
  }
};

export const useSearchData = (searchTerm: string) => {
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["search-data", searchTerm],
    queryFn: () => handleSearch(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 3,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    data,
    error,
    isPending,
    isError,
  };
};