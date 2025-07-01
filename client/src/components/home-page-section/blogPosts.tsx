import {
  Bookmark,
  Newspaper,
  Users,
  Ellipsis,
  Heart,
  MessageCircle,
  FileText,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent } from "../ui/card";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePostsData } from "@/hooks/usePostsData";
import BlogsSkeleton from "./blogsSkeleton";
import { useNavigate } from "react-router-dom";
import type { IPostData } from "../../../../types/dist";

const BlogPosts = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const { posts, hasMore, isLoading, fetchNextPage, isFetchingNextPage } =
    usePostsData();


  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isLoading || isFetchingNextPage) return;

    // Get the scroll position and container dimensions
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Calculate if we're near the bottom (within 100px)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && posts?.length && !isFetchingNextPage) {
      setHasScrolledToBottom(true);
      fetchNextPage();
    } else {
      setHasScrolledToBottom(false);
    }
  }, [posts?.length, hasMore, isLoading, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add the scroll event listener
    container.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Add this effect to check if we need to load initial content
  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && posts?.length === 0 && hasMore) {
      fetchNextPage();
    }
  }, [isLoading, isFetchingNextPage, posts, hasMore, fetchNextPage]);

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

  const StatItem = ({
    icon: Icon,
    count,
    label,
    hoverColor,
  }: {
    icon: any;
    count: number;
    label: string;
    hoverColor: string;
  }) => (
    <div className="flex gap-1 items-center">
      <Icon
        className={`size-5 text-muted-foreground transition-colors duration-200 ${hoverColor}`}
      />
      <span className="text-sm font-medium text-muted-foreground">{count}</span>
      <span className="hidden lg:flex text-sm font-medium text-muted-foreground">
        {count !== 1 ? `${label}s` : label}
      </span>
    </div>
  );

  const PostCard = ({ post }: { post: IPostData }) => (
    <Card
      className="bg-card cursor-pointer dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0"
      onClick={() =>
        navigate(`/post/${post.postTitle}`, { state: { postId: post.id } })
      }
    >
      <CardContent className="py-3 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="size-10 border border-border flex items-center justify-center">
            <AvatarImage src={post.creator.avatar ?? undefined} alt="avatar"/>
            <AvatarFallback className="text-sm font-bold text-foreground">
              {post.creator.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.creator.name}</p>
            <span className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div
          className={
            post.postBannerImage ? "md:flex md:h-28 md:justify-between" : ""
          }
        >
          <div
            className={post.postBannerImage ? "flex-1 mb-2 md:mr-4" : "mb-2"}
          >
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary transition-colors duration-200">
              {post.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2">
              {post.postDescription}
            </p>
          </div>

          {post.postBannerImage && (
            <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={post.postBannerImage}
                alt="Post banner"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-4">
            <StatItem
              icon={Heart}
              count={post.postLikes.length}
              label="like"
              hoverColor="hover:text-red-500"
            />
            <StatItem
              icon={MessageCircle}
              count={post.postComments.length}
              label="comment"
              hoverColor="hover:text-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 mb-6 flex items-center justify-center bg-muted/50 rounded-full">
        <FileText className="w-16 h-16 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No blog posts yet
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {activeTab === "Discover"
          ? "Be the first to discover amazing content! Check back later for new posts."
          : "You're not following anyone yet. Follow some writers to see their posts here."}
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

      {/* Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
      >
        <div className="space-y-4 pb-4">
          {isLoading && !posts?.length && <BlogsSkeleton />}

          {!isLoading && posts?.length === 0 && <EmptyState />}

          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Loading more */}
          {isFetchingNextPage && (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`loading-${index}`}>
                  <BlogsSkeleton showSingle />
                </div>
              ))}
            </div>
          )}

          {/* Show end of feed message only if we've scrolled to bottom and there are no more posts */}
          {!hasMore && posts && posts.length > 0 && hasScrolledToBottom && (
            <EndOfFeed />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;
