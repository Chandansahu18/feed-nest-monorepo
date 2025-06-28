import { FEEDNEST_BACKEND_API } from "@/utils/apiClient"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useRef } from "react"
import type { IPostData, IPostsDataResponse } from "../../../types/dist";

const handleAllPosts = async (cursor?: string): Promise<IPostsDataResponse> => {
   try {
     const response = await FEEDNEST_BACKEND_API.get('/v1/posts', {
        params: { cursor },
        withCredentials: true,
    })
    return response.data
   } catch (error) {      
     const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
   }
}

export const usePostsData = (cursor?: string) => {
    const allPosts = useRef<IPostData[]>([])
    const canFetch = useRef(true)
    
    const query = useQuery({
        queryKey: ['posts', cursor],
        queryFn: () => handleAllPosts(cursor),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: keepPreviousData,
        enabled: canFetch.current
    })

    if (query?.data?.data) {
        if (query?.data?.data?.length === 0) {
            canFetch.current = false
        } else {
            if (!cursor) {
                allPosts.current = query?.data?.data
            } else {
                const existingIds = allPosts.current.map(post => post.id)
                const newPosts = query?.data?.data?.filter((post: IPostData) => 
                    !existingIds.includes(post.id)
                )
                allPosts.current = [...allPosts.current, ...newPosts]
            }
        }
    }

    return {
      ...query,
      data: allPosts.current,
      hasMore: canFetch.current,
      isPending: query.isPending,
      error: query.error
    }
}