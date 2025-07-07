import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostData } from "@/hooks/usePostData";
import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Clock,
  User,
  ArrowLeft,
  Ellipsis
} from "lucide-react";
import { usePostCommentsData } from "@/hooks/usePostComments";
import { MarkdownRenderer } from "@/components/post-page-sections/MarkDown";
import { Button } from "@/components/ui/button";

const PostPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data: PostData, error, isPending } = usePostData(state.postId);
  const { data: postComments } = usePostCommentsData(state.postId);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: PostData?.data?.postTitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          <div className="h-48 sm:h-64 md:h-80 bg-gray-200 rounded-lg"></div>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-300"></div>
              <div className="space-y-3">
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-40"></div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <div className="h-4 sm:h-5 bg-gray-200 rounded"></div>
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-red-500 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            Error loading post
          </h2>
          <p className="text-sm sm:text-base">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!PostData) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            Post not found
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            The post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasBannerImage = PostData?.data?.postBannerImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {hasBannerImage && (
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
          <img
            src={`${PostData.data?.postBannerImage}`}
            alt={PostData.data?.postTitle}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                {PostData.data?.postTitle}
              </h1>

              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white bg-opacity-20 backdrop-blur-sm overflow-hidden border-2 border-white border-opacity-30 flex-shrink-0">
                  {PostData.data?.creator.avatar ? (
                    <img
                      src={`${PostData.data?.creator.avatar}`}
                      alt={PostData.data?.creator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-base sm:text-lg md:text-xl truncate">
                    {PostData.data?.creator.name}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base opacity-90">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      {PostData.data?.createdAt
                        ? new Date(PostData.data.createdAt).toLocaleDateString()
                        : null}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="max-w-3xl mx-auto">
          {!hasBannerImage && (
            <>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 leading-tight text-gray-900">
                {PostData.data?.postTitle}
              </h1>

              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 border-b border-gray-200">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {PostData.data?.creator.avatar ? (
                    <img
                      src={`${FEEDNEST_BACKEND_API}${PostData.data?.creator.avatar}`}
                      alt={PostData.data?.creator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                      <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-900 truncate">
                    {PostData.data?.creator.name}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-sm sm:text-base text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      {PostData.data?.createdAt
                        ? new Date(PostData.data.createdAt).toLocaleDateString()
                        : "Date not available"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10 py-3 sm:py-4 border-y border-gray-200">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <Button
              variant={"ghost"}
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 text-sm sm:text-base ${
                isLiked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
              }`}
              >
                <Heart
                  />
                <span className="font-medium">
                  {likeCount > 0 ? likeCount : "Like"}
                </span>
              </Button>

              <Button
              variant={"ghost"}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base"
              >
                <MessageCircle />
                <span className="font-medium">
                  {postComments?.data?.length} Comment
                  {postComments?.data?.length !== 1 ? "s" : ""}
                </span>
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={handleSave}
                variant={"ghost"}
                className={`p-2 sm:p-3 rounded-full transition-all duration-200 ${
                  isSaved
                  ? "text-blue-500 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
                }`}
                >
                <Bookmark
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isSaved ? "fill-current" : ""
                  }`}
                  />
              </Button>

              <Button
                variant={"ghost"}
                onClick={handleShare}
                className="p-2 sm:p-3 rounded-full text-gray-600 hover:text-green-500 hover:bg-gray-100 transition-all duration-200"
                >
                <Share2 />
              </Button>
              <Button
                variant={"ghost"}
                className="p-2 sm:p-3 rounded-full text-gray-600 hover:text-green-500 hover:bg-gray-100 transition-all duration-200" 
                >
                <Ellipsis/>
              </Button>
            </div>
          </div>

          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="mb-6 sm:mb-8 lg:mb-10 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
              {PostData.data?.postDescription ? (
                <MarkdownRenderer content={PostData.data.postDescription} />
              ) : (
                <p className="text-gray-500 italic">
                  No content available for this post.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showComments && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                  Top comments ({postComments?.data?.length ?? 0})
                </h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newComment.trim()) return;
                  setNewComment("");
                }}
                className="mb-8 sm:mb-10 lg:mb-12"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add to the discussion"
                      className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base md:text-lg transition-colors"
                      rows={3}
                    />
                    <div className="mt-3 sm:mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base md:text-lg"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="space-y-6 sm:space-y-8">
                {postComments?.data?.map((comment) => (
                  <div key={comment.id} className="flex gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="text-xs sm:text-sm md:text-base text-gray-500 flex-shrink-0">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg break-words">
                        {comment.comment}
                      </p>
                      <div className="flex items-center gap-4 sm:gap-6">
                        <button className="flex items-center gap-1 text-xs sm:text-sm md:text-base text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Like</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
