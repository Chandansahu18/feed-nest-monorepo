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
import { useEffect, useRef, useState } from "react";
import { usePostsData } from "@/hooks/usePostsData";
import BlogsSkeleton from "./blogsSkeleton";

const BlogPosts = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const [cursorId, setCursorId] = useState<string | undefined>(undefined);
  const { data: PostsData, hasMore, isPending } = usePostsData(cursorId);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isPending || isLoadingMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (atBottom && PostsData?.length) {
        setIsLoadingMore(true);
        const lastPost = PostsData[PostsData.length - 1];
        setCursorId(lastPost.id);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [PostsData, hasMore, isPending, isLoadingMore]);

  useEffect(() => {
    if (PostsData?.length && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [PostsData, isLoadingMore]);

  const handleBookmarkBlog = () => {};

  const TabButton = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => (
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

  const PostCard = ({ post, index }: { post: any; index: number }) => (
    <Card
      key={post.id || `${post.id}-${index}`}
      className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0 will-change-transform"
    >
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
            <AvatarImage src={post.creator.avatar ?? undefined} alt="avatar-image" />
            <AvatarFallback className="text-sm font-bold text-foreground">
              {post.creator.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.creator.name}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className={`${
          post.postBannerImage
            ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]"
            : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
        }`}>
          <div className={`${post.postBannerImage ? "h-full md:w-md xl:w-[500px] mb-2" : "mb-2"}`}>
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer transition-colors duration-200">
              {post.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2">{post.postDescription}</p>
          </div>
          {post.postBannerImage && (
            <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
              <img
                src={post.postBannerImage}
                alt="post-image"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex items-center h-6 justify-between mt-3">
          <div className="flex gap-4 mx-1">
            <div className="flex gap-1 items-center">
              <Heart className="size-5 text-muted-foreground transition-colors duration-200 hover:text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {post.postLikes.length}
              </span>
              <span className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {post.postLikes.length !== 1 ? "likes" : "like"}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle className="size-5 text-muted-foreground transition-colors duration-200 hover:text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {post.postComments.length}
              </span>
              <span className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {post.postComments.length !== 1 ? "comments" : "comment"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
            onClick={handleBookmarkBlog}
          >
            <Bookmark className="size-5" />
          </Button>
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
          : "You're not following anyone yet. Follow some writers to see their posts here."
        }
      </p>
      <Button 
        variant="outline" 
        className="rounded-xl transition-all duration-200 hover:scale-105"
        onClick={() => setActiveTab(activeTab === "Discover" ? "Following" : "Discover")}
      >
        {activeTab === "Discover" ? "Explore Following" : "Discover Posts"}
      </Button>
    </div>
  );

  return (
    <div className="max-[768px]:w-full md:w-2xl lg:w-3xl h-full flex flex-col">
      <div className="flex-shrink-0 bg-background border-b border-border/50 pb-4 mb-5">
        <div className="flex space-x-1 justify-between items-center pt-4">
          <div className="flex space-x-2">
            <TabButton tab="Discover" icon={Newspaper} label="Discover" />
            <TabButton tab="Following" icon={Users} label="Following" />
          </div>
          <Button className="rounded-xl mr-0 md:mr-3 transition-all duration-200 hover:scale-105" variant="ghost">
            <Ellipsis className="text-muted-foreground size-5" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto smooth-scroll"
        style={{ 
          scrollbarWidth: "none",
          scrollBehavior: "smooth"
        }}
      >
        <div className="space-y-6 pb-6">
          {/* Initial loading skeleton */}
          {isPending && !PostsData?.length && <BlogsSkeleton />}

          {/* Empty state when no posts and not loading */}
          {!isPending && PostsData?.length === 0 && <EmptyState />}

          {/* Posts */}
          {PostsData?.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}

          {/* Loading more skeleton - only show when we have existing posts and are loading more */}
          {isLoadingMore && PostsData && PostsData.length > 0 && (
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`loading-skeleton-${index}`}>
                  <BlogsSkeleton showSingle />
                </div>
              ))}
            </div>
          )}

          {/* End message */}
          {!hasMore && PostsData && PostsData.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p>You've reached the end</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;