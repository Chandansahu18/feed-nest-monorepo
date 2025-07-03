import {
  Newspaper,
  Users,
  Heart,
  MessageCircle,
  FileText,
  Bookmark,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent } from "../ui/card";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { usePostsData } from "@/hooks/usePostsData";
import BlogsSkeleton from "./blogsSkeleton";
import { useNavigate } from "react-router-dom";
import type { IPostData } from "../../../../types/dist";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useGetBookmarkedPosts } from "@/hooks/useGetBookmarkedPosts";
import { usePostBookmark } from "@/hooks/usePostBookmark";
import { useUserData } from "@/hooks/useUserData";

const BlogPosts = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  const [localBookmarkedPosts, setLocalBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useUserData();
  const { mutate: BookmarkPost } = usePostBookmark();
  const { posts, hasMore, isLoading, fetchNextPage, isFetchingNextPage } =
    usePostsData();
  const { data: BookmarkedPost } = useGetBookmarkedPosts({
    userId: userData?.data?.id!,
  });

  // Get bookmarked post IDs from API data
  const bookmarkedPostIds = useMemo(() => {
    if (!BookmarkedPost?.data) return new Set<string>();
    const bookmarkedPosts = Array.isArray(BookmarkedPost.data)
      ? BookmarkedPost.data
      : [BookmarkedPost.data];
    return new Set(bookmarkedPosts.map((bp) => bp.post.id));
  }, [BookmarkedPost]);

  // Update local state when API data changes
  useEffect(
    () => setLocalBookmarkedPosts(bookmarkedPostIds),
    [bookmarkedPostIds]
  );

  // Filter posts based on active tab
  const filteredPosts = useMemo(
    () =>
      activeTab === "Bookmarks"
        ? posts?.filter((post) => localBookmarkedPosts.has(post.id)) || []
        : posts || [],
    [posts, activeTab, localBookmarkedPosts]
  );

  // Scroll handler for infinite scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isLoading || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && posts?.length && !isFetchingNextPage) {
      setHasScrolledToBottom(true);
      fetchNextPage();
    } else {
      setHasScrolledToBottom(false);
    }
  }, [posts?.length, hasMore, isLoading, isFetchingNextPage, fetchNextPage]);

  // Setup scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Initial fetch if no posts
  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && posts?.length === 0 && hasMore) {
      fetchNextPage();
    }
  }, [isLoading, isFetchingNextPage, posts, hasMore, fetchNextPage]);

  // Handle bookmark toggle
  const handleBookmark = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userData?.data?.id) return navigate("/");

    setRemovingBookmark(postId);
    setLocalBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });

    BookmarkPost({ postId, userId: userData.data.id });
    setRemovingBookmark(null);
  };

  // Clean markdown content
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

  // Tab button component
  const TabButton = ({
    tab,
    icon: Icon,
    label,
  }: {
    tab: string;
    icon: any;
    label: string;
  }) => (
    <Button
      variant={activeTab === tab ? "default" : "ghost"}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center rounded-xl space-x-2 transition-all duration-200 ${
        activeTab === tab
          ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-5 hidden md:flex" />
      <span className="text-sm">{label}</span>
    </Button>
  );

  // Post card component
  const PostCard = ({ post }: { post: IPostData }) => {
    const isBookmarked = localBookmarkedPosts.has(post.id);

    return (
      <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0 cursor-pointer group">
        <CardContent
          className="py-6 border-b max-[375px]:px-0 lg:border-0"
          onClick={() =>
            navigate(`/post/${post.postTitle}`, { state: { postId: post.id } })
          }
        >
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
              <AvatarImage
                src={post.creator.avatar ?? undefined}
                alt="avatar-image"
              />
              <AvatarFallback className="text-sm font-bold text-foreground">
                {post.creator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {post.creator.name}
              </p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div
            className={
              post.postBannerImage
                ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]"
                : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
            }
          >
            <div
              className={
                post.postBannerImage
                  ? "h-full md:w-md xl:w-[500px] mb-2"
                  : "mb-2"
              }
            >
              <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer group-hover:text-primary transition-colors">
                {post.postTitle}
              </h2>
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {cleanMarkdownContent(post.postDescription)}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.postTags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
                {post.postTags.length > 3 && (
                  <Badge variant="outline" className="text-xs rounded-full">
                    +{post.postTags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            {post.postBannerImage && (
              <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
                <img
                  src={post.postBannerImage}
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
                    post.postLikes.length > 0
                      ? "text-red-500 fill-current"
                      : "text-muted-foreground"
                  )}
                />
                <h1 className="text-sm font-medium text-muted-foreground">
                  {post.postLikes.length}
                </h1>
                <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                  {post.postLikes.length > 1 ? "likes" : "like"}
                </h1>
              </div>
              <div className="flex gap-1 items-center">
                <MessageCircle className="size-5 text-muted-foreground" />
                <h1 className="text-sm font-medium text-muted-foreground">
                  {post.postComments.length}
                </h1>
                <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                  {post.postComments.length > 1 ? "comments" : "comment"}
                </h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-blue-600"
              onClick={(e) => handleBookmark(post.id, e)}
              disabled={removingBookmark === post.id}
            >
              {removingBookmark === post.id ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Bookmark
                  className={cn(
                    "size-5 transition-colors",
                    isBookmarked
                      ? "text-blue-600 fill-blue-600"
                      : "text-muted-foreground"
                  )}
                />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 mb-6 flex items-center justify-center bg-muted/50 rounded-full">
        <FileText className="w-16 h-16 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground max-w-md mb-6">
        {activeTab === "Discover"
          ? "Be the first to discover amazing content! Check back later for new posts."
          : activeTab === "Following"
          ? "You're not following anyone yet. Follow some writers to see their posts here."
          : "You haven't bookmarked any posts yet. Save your favorite posts to read them later."}
      </p>
      <Button
        variant="outline"
        className="rounded-xl transition-all duration-200 hover:scale-105"
        onClick={() =>
          setActiveTab(activeTab === "Discover" ? "Following" : "Discover")
        }
      >
        {activeTab === "Discover" ? "Explore Following" : "Discover Posts"}
      </Button>
    </div>
  );

  // End of feed component
  const EndOfFeed = () => (
    <div className="text-center py-4 text-muted-foreground">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-2">
        <FileText className="w-6 h-6" />
      </div>
      <p>You've reached the end</p>
    </div>
  );

  return (
    <div className="max-[768px]:w-full md:w-2xl lg:w-3xl h-full flex flex-col">
      <div className="flex-shrink-0 bg-background border-border/50 pb-4 mb-5">
        <div className="flex justify-between items-center pt-4">
          <div className="flex space-x-2">
            <TabButton tab="Discover" icon={Newspaper} label="Discover" />
            <TabButton tab="Following" icon={Users} label="Following" />
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
      >
        <div className="space-y-4 pb-4">
          {isLoading && !filteredPosts?.length && <BlogsSkeleton />}
          {!isLoading && filteredPosts?.length === 0 && <EmptyState />}
          {filteredPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {isFetchingNextPage && (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`loading-${index}`}>
                  <BlogsSkeleton showSingle />
                </div>
              ))}
            </div>
          )}
          {!hasMore &&
            filteredPosts &&
            filteredPosts.length > 0 &&
            hasScrolledToBottom && <EndOfFeed />}
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;