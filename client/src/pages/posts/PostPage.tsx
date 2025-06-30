import { usePostData } from "@/hooks/usePostData";
import { useLocation } from "react-router-dom";
import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";

const PostPage = () => {
  const { state } = useLocation();
  const { data, error, isPending } = usePostData(state.postId);

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-red-500">Error loading post: {error.message}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div>Post not found</div>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto px-4 py-8">     
      {/* Main title */}
      <h1 className="text-3xl font-bold mb-6">{data.data?.postTitle}</h1>
      
      {/* Author and date info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {data.data?.creator.avatar && (
            <img 
              src={`${FEEDNEST_BACKEND_API}${data.data?.creator.avatar}`} 
              alt={data.data?.creator.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="font-medium">{data.data?.creator.name}</p>
          <p className="text-sm text-gray-500">
            {data.data? new Date(data.data?.createdAt).toLocaleDateString() : ''}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default PostPage;