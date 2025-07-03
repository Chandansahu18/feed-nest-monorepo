import { usePostData } from "@/hooks/usePostData";
import { useLocation } from "react-router-dom";
import { FEEDNEST_BACKEND_API } from "@/utils/apiClient";
import { useState } from "react";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Clock,
  User,
} from "lucide-react";
import { usePostCommentsData } from "@/hooks/usePostComments";

const PostPage = () => {
  const { state } = useLocation();
  const { data: PostData, error, isPending } = usePostData(state.postId);
  const {data:postComments} = usePostCommentsData(state.postId);
  console.log(PostData);
  console.log(postComments);
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState();

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

  // const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!newComment.trim()) return;

  //   const comment = {
  //     id: Date.now(),
  //     author: postComments?.data,
  //     avatar: postComments?.data?.creator.avatar,
  //     content: newComment,
  //     createdAt: postComments?.data?.createdAt,
  //     likes: postComments?.data?.postLikes,
  //   };

  //   setComments(comment);
  //   setNewComment("");
  // };

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
        </div>
      </div>
    );
  }

  const hasBannerImage = PostData?.data?.postBannerImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Image Section */}
      {hasBannerImage && (
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
          <img
            src={`${PostData.data?.postBannerImage}`}
            alt={PostData.data?.postTitle}
            className="w-full h-full object-cover"
          />

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                {PostData.data?.postTitle}
              </h1>

              {/* Author info */}
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title and Author for non-banner version */}
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
                    <span className="hidden sm:inline">4 min read</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10 py-3 sm:py-4 border-y border-gray-200">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 text-sm sm:text-base ${
                  isLiked
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">
                  {likeCount > 0 ? likeCount : "Like"}
                </span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-medium">
                  {postComments?.data?.postComments?.length} Comment{postComments?.data?.postComments?.length !== 1 ? "s" : ""}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleSave}
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
              </button>

              <button
                onClick={handleShare}
                className="p-2 sm:p-3 rounded-full text-gray-600 hover:text-green-500 hover:bg-gray-100 transition-all duration-200"
              >
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none mb-8 sm:mb-12 lg:mb-16">
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                {PostData.data?.postDescription ||
                  "Working with arrays is at the heart of JavaScript development, whether you're managing UI state in React or handling data on the server. Yet many developers focus on appending items to the end of an array and overlook the importance of efficiently adding elements to the front. Why does inserting an item at index 0 matter, and how can you do it cleanly and performantly?"}
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                The simplest answer is to use methods like{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base font-mono text-purple-600">
                  unshift
                </code>{" "}
                or the modern spread syntax. Understanding these techniques not
                only prevents unintended side effects but also helps you choose
                the right approach for your use case—keeping your code readable
                and your app snappy.
              </p>
            </div>

            {/* Example code block */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
                Using unshift
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-x-auto">
                <pre className="text-xs sm:text-sm md:text-base text-gray-100">
                  <code>
                    {`const fruits = ['apple', 'banana'];
const newLength = fruits.unshift('orange');
console.log(fruits); // ['orange', 'apple', 'banana']
console.log(newLength); // 3`}
                  </code>
                </pre>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-3 sm:mt-4">
                <strong>Tip:</strong> Because{" "}
                <code className="bg-gray-100 px-1.5 py-1 rounded text-xs sm:text-sm font-mono">
                  unshift
                </code>{" "}
                modifies the existing array, avoid this in contexts where
                immutability is important.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                  Top comments ({postComments?.data?.postComments?.length ?? 0})
                </h3>
               
              </div>

              {/* Add Comment Form */}
              <form
                onSubmit={handleCommentSubmit}
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

              {/* Comments List */}
              <div className="space-y-6 sm:space-y-8">
                {postComments?.data?.map((comment) => (
                  <div key={comment.id} className="flex gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="font-medium text-gray-900 text-base sm:text-lg truncate">
                          {comment.author}
                        </span>
                        <span className="text-xs sm:text-sm md:text-base text-gray-500 flex-shrink-0">
                          • {comment.createdAt}
                        </span>
                        <button className="ml-auto text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg break-words">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 sm:gap-6">
                        <button className="flex items-center gap-1 text-xs sm:text-sm md:text-base text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>
                            {comment.likes > 0 ? comment.likes : "Like"}
                          </span>
                        </button>
                        <button className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-blue-500 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500">
                <button className="hover:text-gray-700">Code of Conduct</button>
                <span className="hidden sm:inline">•</span>
                <button className="hover:text-gray-700">Report abuse</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-around shadow-lg">
        <button
          onClick={handleLike}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-xs mt-1">
            {likeCount > 0 ? likeCount : "Like"}
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            showComments ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs mt-1">
            {postComments?.data?.postComments?.length} {postComments?.data?.postComments?.length === 1 ? "Comment" : "Comments"}
          </span>
        </button>

        <button
          onClick={handleSave}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            isSaved ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          <span className="text-xs mt-1">Save</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center justify-center p-2 rounded-full text-gray-600 hover:text-green-500 transition-all duration-200"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs mt-1">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostPage;
