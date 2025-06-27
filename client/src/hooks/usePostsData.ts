import { FEEDNEST_BACKEND_API } from "@/utils/apiClient"
import { useQuery } from "@tanstack/react-query"
import type { IPostsDataResponse } from "../../../types/dist";



const handleAllPosts = async (cursor?:string): Promise<IPostsDataResponse> =>{
    try{
    const response = await FEEDNEST_BACKEND_API.get('/v1/posts',{
        params:{cursor},
        withCredentials:true,
    })
    console.log(response.data);
    
    return response.data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    throw new Error(errorMessage);
  }
}

export const usePostsData = (cursor?:string) => {
     const {data, isError, error, isPending} = useQuery({
        queryKey:['posts'],
        queryFn:() => handleAllPosts(cursor),
        retry:false,
        refetchOnWindowFocus:false,
        refetchOnMount:false
     })

return{
    data,
    error,
    isError,
    isPending
}
}

