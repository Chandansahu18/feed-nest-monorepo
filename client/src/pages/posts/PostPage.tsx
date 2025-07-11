import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Ellipsis,
  Trash2,
  Edit,
} from "lucide-react";
import { usePostCommentsData } from "@/hooks/usePostComments";
import { MarkdownRenderer } from "@/components/post-page-sections/MarkDown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePostBookmark } from "@/hooks/usePostBookmark";
import { useUserData } from "@/hooks/useUserData";
import { useGetBookmarkedPosts } from "@/hooks/useGetBookmarkedPosts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostDelete } from "@/hooks/usePostDelete";

const PostPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return;
  const uuidLength = 36;
  const separatorIndex = slug.length - uuidLength - 1;
  if (separatorIndex < 0) return;
  const postId = slug.substring(separatorIndex + 1);
  const { data: PostData, error, isPending } = usePostData(postId);
  const { data: userData } = useUserData();
  const { mutate: deletePost } = usePostDelete();
  const { data: bookmarkedPostsData } = useGetBookmarkedPosts({
    userId: userData?.data?.id!,
  });
  const { mutate: bookmarkPost } = usePostBookmark();
  const { data: postComments } = usePostCommentsData(postId);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [localBookmarkedPosts, setLocalBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );
  const bookmarkedPostIds = useMemo(() => {
    if (!bookmarkedPostsData?.data) return new Set<string>();
    const posts = Array.isArray(bookmarkedPostsData.data)
      ? bookmarkedPostsData.data
      : [bookmarkedPostsData.data];
    return new Set(posts.map((bp) => bp.post.id));
  }, [bookmarkedPostsData]);

  useEffect(() => {
    setLocalBookmarkedPosts(bookmarkedPostIds);
  }, [bookmarkedPostIds]);

  const isCurrentPostBookmarked = PostData?.data?.id
    ? localBookmarkedPosts.has(PostData.data.id)
    : false;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = async () => {
    if (!userData?.data?.id) return navigate("/login");
    if (!PostData?.data?.id) return;

    setIsBookmarking(true);
    try {
      setLocalBookmarkedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(PostData?.data?.id ?? "")) {
          newSet.delete(PostData?.data?.id ?? "");
        } else {
          newSet.add(PostData?.data?.id ?? "");
        }
        return newSet;
      });
      bookmarkPost({ postId: PostData.data.id, userId: userData.data.id });
    } finally {
      setIsBookmarking(false);
    }
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

  const handleEditPost = () => {
    navigate(
      `/post/${encodeURIComponent(PostData?.data?.postTitle ?? "")}-${
        PostData?.data?.id
      }/edit`
    );
  };

  const handleDeletePost = () => {
    if (PostData?.data?.id) {
      deletePost({ ids: [PostData.data.id] });
    }
    userData?.data ? navigate("/home") : navigate("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-article-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <Card className="p-8">
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-article-background flex items-center justify-center">
        <Card className="max-w-md mx-4 p-8 text-center">
          <div className="text-red-500 space-y-4">
            <h2 className="text-xl font-semibold">Error loading post</h2>
            <p className="text-sm text-article-text-muted">{error.message}</p>
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!PostData) {
    return (
      <div className="min-h-screen bg-article-background flex items-center justify-center">
        <Card className="max-w-md mx-4 p-8 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-article-text">
              Post not found
            </h2>
            <p className="text-article-text-muted">
              The post you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const hasBannerImage = PostData?.data?.postBannerImage;

  return (
    <div className="min-h-screen bg-article-background">
      {hasBannerImage && (
        <div className="relative w-full h-96 bg-gradient-header overflow-hidden">
          <img
            src={`${PostData.data?.postBannerImage}`}
            alt={PostData.data?.postTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {PostData.data?.postTitle}
              </h1>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border-2 border-white/30 flex-shrink-0">
                  {PostData.data?.creator.avatar ? (
                    <img
                      src={`${PostData.data?.creator.avatar}`}
                      alt={PostData.data?.creator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">
                    {PostData.data?.creator.name}
                  </p>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Clock className="w-4 h-4" />
                    {PostData.data?.createdAt
                      ? new Date(PostData.data.createdAt).toLocaleDateString()
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {/* Like Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size={"icon"}
              onClick={handleLike}
              className={`rounded-full p-2 ${
                isLiked
                  ? "text-red-600 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart
                className={`size-5 sm:size-6 ${isLiked ? "fill-current" : ""}`}
              />
              <span className="sr-only">Like</span>
            </Button>
            <span className="text-sm font-medium text-muted-foreground ml-1">
              {likeCount}
            </span>
          </div>

          {/* Comments Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size={"icon"}
              onClick={() => setShowComments(!showComments)}
              className={`rounded-full p-2 text-muted-foreground hover:text-foreground`}
            >
              <MessageCircle className="size-5 sm:size-6" />
              <span className="sr-only">Comments</span>
            </Button>
            <span className="text-sm font-medium text-muted-foreground ml-1">
              {postComments?.data?.length}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size={"icon"}
              onClick={handleBookmark}
              disabled={isBookmarking}
              className={`rounded-full p-2 ${
                isBookmarking
                  ? "text-muted-foreground"
                  : isCurrentPostBookmarked
                  ? "text-blue-600 hover:text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isBookmarking ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Bookmark
                  className={`size-5 sm:size-6 ${
                    isCurrentPostBookmarked ? "fill-current" : ""
                  }`}
                />
              )}
              <span className="sr-only">Bookmark</span>
            </Button>
          </div>

          {/* Share Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleShare}
              className="rounded-full p-2 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="size-5 sm:size-6" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          {/* Options Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground"
                >
                  <Ellipsis className="size-5 sm:size-6" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-40 p-2 rounded-lg border bg-background shadow-lg"
                align="end"
              >
                <DropdownMenuItem
                  onClick={handleEditPost}
                  className="flex items-center gap-2 cursor-pointer focus:bg-accent"
                >
                  <Edit className="size-4 text-muted-foreground" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeletePost}
                  className="flex items-center gap-2 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
                >
                  <Trash2 className="size-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 md:p-12">
            {!hasBannerImage && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-article-text mb-8 leading-tight">
                    {PostData.data?.postTitle}
                  </h1>

                  <div className="flex items-center gap-4 pb-8 border-b border-article-border">
                    <div className="w-14 h-14 rounded-full bg-gradient-header overflow-hidden flex-shrink-0">
                      {PostData.data?.creator.avatar ? (
                        <img
                          src={`${FEEDNEST_BACKEND_API}${PostData.data?.creator.avatar}`}
                          alt={PostData.data?.creator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-xl text-article-text">
                        {PostData.data?.creator.name}
                      </p>
                      <div className="flex items-center gap-2 text-article-text-muted">
                        <Clock className="w-4 h-4" />
                        {PostData.data?.createdAt
                          ? new Date(
                              PostData.data.createdAt
                            ).toLocaleDateString()
                          : "Date not available"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-article-text leading-relaxed">
                {PostData.data?.postDescription ? (
                  <MarkdownRenderer content={PostData.data.postDescription} />
                ) : (
                  <p className="text-article-text-muted italic">
                    No content available for this post.
                  </p>
                )}
              </div>
            </div>
          </div>
          {showComments && (
            <>
              <Separator />
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-semibold text-article-text">
                    Top comments ({postComments?.data?.length ?? 0})
                  </h3>
                </div>

                {/* Comment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newComment.trim()) return;
                    setNewComment("");
                  }}
                  className="mb-10"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-header flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add to the discussion"
                        className="w-full p-4 border border-article-border rounded-lg resize-none focus:ring-2 focus:ring-article-accent focus:border-transparent transition-colors text-article-text bg-article-card"
                        rows={3}
                      />
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-6 py-2"
                        >
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="space-y-8">
                  {postComments?.data?.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-header flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-article-text">
                            Ismail Kovvuru
                          </span>
                          <span className="text-sm text-article-text-muted">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-article-text mb-3 leading-relaxed">
                          {comment.comment}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" className="px-3 py-1 text-sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" className="px-3 py-1 text-sm">
                            <MessageCircle className="w-4 h-4" />
                            <span>Reply</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
