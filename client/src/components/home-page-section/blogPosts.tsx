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
import { useState } from "react";
import { usePostsData } from "@/hooks/usePostsData";
import PendingLoader from "../pendingLoader";

const BlogPosts = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const { data: PostsData, isPending } = usePostsData();
  const handleBookmark = () => {
    // Bookmark functionality
  };

  if (isPending) {
    return <PendingLoader />;
  }

  return (
    <div className="max-[425px]:w-auto md:w-2xl lg:w-3xl">
      <div className="flex space-x-1 mb-5 justify-between items-center">
        <div className="flex">
          <Button
            variant={activeTab === "Discover" ? "default" : "ghost"}
            onClick={() => setActiveTab("Discover")}
            className={`flex items-center rounded-xl space-x-2 ${
              activeTab === "Discover"
                ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Newspaper className="size-5 hidden md:flex" />
            <span className="text-sm">Discover</span>
          </Button>
          <Button
            variant={activeTab === "Following" ? "default" : "ghost"}
            onClick={() => setActiveTab("Following")}
            className={`flex items-center rounded-xl space-x-2 ${
              activeTab === "Following"
                ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-5 hidden md:flex" />
            <span className="text-sm">Following</span>
          </Button>
        </div>
        <div className="mr-0 md:mr-3">
          <Ellipsis className="text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-6">
        {PostsData?.data?.map((post) => (
          <Card
            key={post.id}
            className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0"
          >
            <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
                  <AvatarImage
                    src={post.creator.avatar ?? undefined}
                    alt="avatar-image"
                  />
                  <AvatarFallback className="text-sm font-bold text-foreground">
                    CS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {post.creator.name}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{new Date(post.createdAt).getTime()}</span>
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
                  <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer">
                    {post.postTitle}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.postDescription}
                  </p>
                </div>
                {post.postBannerImage ? (
                  <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
                    <img
                      src={post.postBannerImage ?? undefined}
                      alt="post-image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex items-center h-6 justify-between mt-3">
                <div className="flex gap-4 mx-1">
                  <div className="flex gap-1 items-center">
                    <Heart className="size-5 text-muted-foreground" />
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
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleBookmark}
                >
                  <Bookmark className="size-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
