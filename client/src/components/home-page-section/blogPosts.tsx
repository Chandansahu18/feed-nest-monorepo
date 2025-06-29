import {
  Bookmark,
  Newspaper,
  Users,
  Ellipsis,
  Heart,
  MessageCircle,
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
    if (!container || !hasMore || isPending) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 20;

      if (atBottom && !isLoadingMore && PostsData?.length) {
        setIsLoadingMore(true);
        const lastPost = PostsData[PostsData.length - 1];
        setCursorId(lastPost.id);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [PostsData, hasMore, isLoadingMore, isPending]);

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
      className={`flex items-center rounded-xl space-x-2 ${
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
      className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0"
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
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer">
              {post.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2">{post.postDescription}</p>
          </div>
          {post.postBannerImage && (
            <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
              <img
                src={post.postBannerImage}
                alt="post-image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex items-center h-6 justify-between mt-3">
          <div className="flex gap-4 mx-1">
            <div className="flex gap-1 items-center">
              <Heart className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {post.postLikes.length}
              </span>
              <span className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {post.postLikes.length !== 1 ? "likes" : "like"}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle className="size-5 text-muted-foreground" />
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
            className="text-muted-foreground hover:text-foreground"
            onClick={handleBookmarkBlog}
          >
            <Bookmark className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      ref={containerRef}
      className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto"
      style={{ height: "100vh", scrollbarWidth: "none" }}
    >
      {/* Header with tabs */}
      <div className="flex space-x-1 mb-5 justify-between items-center">
        <div className="flex space-x-2">
          <TabButton tab="Discover" icon={Newspaper} label="Discover" />
          <TabButton tab="Following" icon={Users} label="Following" />
        </div>
        <Button className="rounded-xl mr-0 md:mr-3" variant="ghost">
          <Ellipsis className="text-muted-foreground size-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Initial loading skeleton */}
        {isPending && !PostsData?.length && <BlogsSkeleton />}

        {/* Posts */}
        {PostsData?.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}

        {/* Loading more skeleton */}
        {(isLoadingMore || (isPending && PostsData?.length)) && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`loading-skeleton-${index}`}>
                <BlogsSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* End message */}
        {!hasMore && PostsData?.length && (
          <div className="text-center py-4 text-muted-foreground">
            You've reached the end
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPosts;