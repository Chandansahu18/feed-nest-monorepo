import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Heart, MessageCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import type { IPostData, ISavedPostData } from "../../../../types/dist";
import { useUserData } from "@/hooks/user/useUserData";
import { usePostBookmark } from "@/hooks/post/bookmark/usePostBookmark";
import { useGetBookmarkedPosts } from "@/hooks/post/bookmark/useGetBookmarkedPosts";


const BookmarkedPostsPage = () => {
  const navigate = useNavigate();
  const { data: userData } = useUserData();
  const { mutate: bookmarkPost } = usePostBookmark();
  const { data: bookmarkedPostsData, isPending } = useGetBookmarkedPosts({
    userId: userData?.data?.id!,
  });
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  const [localBookmarkedPosts, setLocalBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );

  const bookmarkedPostIds = useMemo(() => {
    if (!bookmarkedPostsData?.data) return new Set<string>();
    const posts = Array.isArray(bookmarkedPostsData.data)
      ? bookmarkedPostsData.data
      : [bookmarkedPostsData.data];
    return new Set<string>(posts.map((bp:IPostData) => bp.id));
  }, [bookmarkedPostsData]);

  useEffect(() => {
    setLocalBookmarkedPosts(bookmarkedPostIds);
  }, [bookmarkedPostIds]);

  const cleanMarkdownContent = (content: string | null) => {
    if (!content) return "";
    return content
      .replace(/<[^>]*>/g, "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^>\s*/gm, "")
      .replace(/^-{3,}$/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\s+|\s+$/g, "")
      .trim();
  };

  const handleRemoveBookmark = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userData?.data?.id) return navigate("/");

    setRemovingBookmark(postId);
    setLocalBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });

    bookmarkPost({ postId, userId: userData.data.id });
    setRemovingBookmark(null);
  };

  const handleBookmarkedPost = (postTitle:string,postId: string) => {
            navigate(`/bookmarks/${encodeURIComponent(postTitle)}-${postId}`)
  };

  const BookmarksSkeleton = () => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl">
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]">
          <div className="h-full md:w-md xl:w-[500px] mb-2 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="md:w-44 h-36 md:h-full rounded-xl" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );

  if (isPending) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
        <div
          className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto"
          style={{ height: "100vh", scrollbarWidth: "none" }}
        >
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 mx-auto" />
            {Array.from({ length: 3 }).map((_, index) => (
              <BookmarksSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredPosts = useMemo(() => {
    if (!bookmarkedPostsData?.data) return [];
    const posts = Array.isArray(bookmarkedPostsData.data)
      ? bookmarkedPostsData.data
      : [bookmarkedPostsData.data];
    return posts.filter((post:IPostData) => localBookmarkedPosts.has(post.id));
  }, [bookmarkedPostsData, localBookmarkedPosts]);

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div
        className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto"
        style={{ height: "100vh", scrollbarWidth: "none" }}
      >
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-40"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6">
              Start bookmarking posts to see them here
            </p>
            <Button onClick={() => navigate("/")} className="rounded-xl">
              <Eye className="w-4 h-4 mr-2" />
              Explore Posts
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post: ISavedPostData, index: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0 cursor-pointer group">
                  <CardContent
                    className="py-6 border-b max-[375px]:px-0 lg:border-0"
                    onClick={() => handleBookmarkedPost(post.post.postTitle,post.post.id)}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
                        <AvatarImage
                          src={post.post.creator.avatar}
                          alt="avatar-image"
                        />
                        <AvatarFallback className="text-sm font-bold text-foreground">
                          {post.post.creator.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {post.post.creator.name}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>
                            {new Date(post.post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        post.post.postBannerImage
                          ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]"
                          : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
                      }
                    >
                      <div
                        className={
                          post.post.postBannerImage
                            ? "h-full md:w-md xl:w-[500px] mb-2"
                            : "mb-2"
                        }
                      >
                        <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer group-hover:text-primary transition-colors">
                          {post.post.postTitle}
                        </h2>
                        <p className="text-muted-foreground line-clamp-2">
                          {cleanMarkdownContent(post.post.postDescription)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.post.postTags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs rounded-full"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.post.postTags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs rounded-full"
                            >
                              +{post.post.postTags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {post.post.postBannerImage && (
                        <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
                          <img
                            src={post.post.postBannerImage ?? undefined}
                            alt="post-image"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center h-6 justify-between mt-3">
                      <div className="flex gap-4 mx-1">
                        <div className="flex gap-1 items-center">
                          <Heart
                            className={cn(
                              "size-5",
                              post.post.postLikes.length > 0
                                ? "text-red-500 fill-current"
                                : "text-muted-foreground"
                            )}
                          />
                          <h1 className="text-sm font-medium text-muted-foreground">
                            {post.post.postLikes.length}
                          </h1>
                          <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                            {post.post.postLikes.length > 1 ? "likes" : "like"}
                          </h1>
                        </div>
                        <div className="flex gap-1 items-center">
                          <MessageCircle className="size-5 text-muted-foreground" />
                          <h1 className="text-sm font-medium text-muted-foreground">
                            {post.post.postComments.length}
                          </h1>
                          <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                            {post.post.postComments.length > 1
                              ? "comments"
                              : "comment"}
                          </h1>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleRemoveBookmark(post.post.id, e)}
                        disabled={removingBookmark === post.post.id}
                      >
                        {removingBookmark === post.post.id ? (
                          <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Bookmark className="size-5 text-blue-600 fill-blue-600" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredPosts.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">
                You've reached the end of your bookmarks
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkedPostsPage;