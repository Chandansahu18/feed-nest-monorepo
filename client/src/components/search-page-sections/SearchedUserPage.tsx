import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  FileText,
  Bookmark,
  Pen,
} from "lucide-react";
import { useUserData } from "@/hooks/user/useUserData";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useMemo } from "react";
import type { IPost } from "../../../../types/dist";
import { useNavigate } from "react-router-dom";
import { usePostBookmark } from "@/hooks/post/bookmark/usePostBookmark";
import { useGetBookmarkedPosts } from "@/hooks/post/bookmark/useGetBookmarkedPosts";
import { cn } from "@/lib/utils";

const PostCard = ({
  post,
  user,
  avatarFallback,
}: {
  post: IPost;
  user: any;
  avatarFallback: string;
}) => {
  const navigate = useNavigate();
  const { data: userData } = useUserData();
  const { mutate: BookmarkPost } = usePostBookmark();
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  const [localBookmarkedPosts, setLocalBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );

  const { data: BookmarkedPost } = useGetBookmarkedPosts({
    userId: userData?.data?.id!,
  });

  const bookmarkedPostIds = useMemo(() => {
    if (!BookmarkedPost?.data) return new Set<string>();
    const bookmarkedPosts = Array.isArray(BookmarkedPost.data)
      ? BookmarkedPost.data
      : [BookmarkedPost.data];
    return new Set<string>(bookmarkedPosts.map((bp) => bp.id));
  }, [BookmarkedPost]);

  useEffect(() => {
    setLocalBookmarkedPosts(bookmarkedPostIds);
  }, [bookmarkedPostIds]);

  const isBookmarked = localBookmarkedPosts.has(post.id);

  const postData = {
    ...post,
    postTags: post.postTags || [],
    postLikes: post.postLikes || [],
    postComments: post.postComments || [],
    createdAt: post.createdAt || new Date(),
  };

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
            <AvatarImage src={user.avatar ?? undefined} alt="avatar-image" />
            <AvatarFallback className="text-sm font-bold text-foreground">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{new Date(postData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div
          className={
            postData.postBannerImage
              ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[815px]"
              : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
          }
        >
          <div
            className={
              postData.postBannerImage
                ? "h-full md:w-md xl:w-[600px] mb-2"
                : "mb-2"
            }
          >
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer group-hover:text-primary transition-colors">
              {postData.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {postData.postDescription
                ? cleanMarkdownContent(postData.postDescription)
                : "No description available"}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {postData.postTags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs rounded-full"
                >
                  {tag}
                </Badge>
              ))}
              {postData.postTags.length > 3 && (
                <Badge variant="outline" className="text-xs rounded-full">
                  +{postData.postTags.length - 3}
                </Badge>
              )}
            </div>
          </div>
          {postData.postBannerImage && (
            <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
              <img
                src={postData.postBannerImage}
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
                  postData.postLikes.length > 0
                    ? "text-red-500 fill-current"
                    : "text-muted-foreground"
                )}
              />
              <h1 className="text-sm font-medium text-muted-foreground">
                {postData.postLikes.length}
              </h1>
              <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {postData.postLikes.length > 1 ? "likes" : "like"}
              </h1>
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle className="size-5 text-muted-foreground" />
              <h1 className="text-sm font-medium text-muted-foreground">
                {postData.postComments.length}
              </h1>
              <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {postData.postComments.length > 1 ? "comments" : "comment"}
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

export default function SearchedUserPage() {
  const navigate = useNavigate();
  const { data: userData, isPending, isError } = useUserData();
  const [activeTab, setActiveTab] = useState<"published" | "drafts">(
    "published"
  );

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-48 w-full bg-blue-600 overflow-hidden" />
        <div className="relative -mt-16 mb-16">
          <div className="flex justify-center">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-8 space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <div className="flex justify-center gap-6">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">Error loading user data</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = userData?.data || {
    name: "User",
    avatar: null,
    bio: null,
    location: null,
    githubHandle: null,
    linkedInHandle: null,
    twitterHandle: null,
    posts: [],
    postComments: [],
  };

  const avatarFallback = user.name.charAt(0).toUpperCase()
  const publishedPosts =
    user.posts?.filter((post: IPost) => post.published) || [];
  const draftPosts = user.posts?.filter((post: IPost) => !post.published) || [];

  const currentPosts = activeTab === "published" ? publishedPosts : draftPosts;

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="relative h-80 w-full bg-blue-600 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={userData?.data?.profileBanner || undefined}
          alt="banner"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="relative -mt-16 mb-10">
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <Button className="absolute bottom-1 right-1 rounded-full dark:bg-black" variant={"outline"} size={"icon"} onClick={() => navigate('/settings')}>
            <Pen />
          </Button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <motion.div initial="hidden" animate="visible" className="space-y-8">
          <motion.div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {user.bio || "No bio available"}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center gap-3">
                {user.githubHandle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={`${user.githubHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {user.linkedInHandle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={`${user.linkedInHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {user.twitterHandle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={`${user.twitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <FileText className="w-6 h-6 text-primary" />
                  {publishedPosts.length}
                </div>
                <p className="text-sm text-muted-foreground">Posts Published</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  {user.postComments?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Comments Written
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <Separator />
          <motion.div className="space-y-4">
            <div className="text-center w-full">
              <h1 className="inline-block font-bold text-2xl md:text-3xl lg:text-4xl">
                Posts
              </h1>
            </div>
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("published")}
                className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "published"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Published ({publishedPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "drafts"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Drafts ({draftPosts.length})
              </button>
            </div>

            <div className="space-y-4">
              {currentPosts.length > 0 ? (
                currentPosts.map((post: IPost, index: number) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={post}
                      user={user}
                      avatarFallback={avatarFallback}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {activeTab === "published"
                    ? "No published posts yet"
                    : "No draft posts yet"}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
