import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  FileText,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { Skeleton } from "@/components/ui/skeleton";
import type { IPost } from "../../../../types/dist";

export default function UserProfile() {
  const { data: userData, isPending, isError } = useUserData();

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
    posts: [],
    postComments: [],
  };

  const avatarFallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="relative h-48 w-full bg-blue-600 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      <div className="relative -mt-16 mb-10">
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <motion.div initial="hidden" animate="visible" className="space-y-8">
          {/* Profile Info */}
          <motion.div className="text-center space-y-2">
            {/* Name and Follow Button */}
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
            </div>

            {/* Bio */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {user.bio || "No bio available"}
            </p>

            {/* Social Handles and Location */}
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
                      href={`https://github.com/${user.githubHandle}`}
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
                      href={`https://linkedin.com/in/${user.linkedInHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
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
                      href={`https://instagram.com/${user.linkedInHandle}`}
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

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <FileText className="w-6 h-6 text-primary" />
                  {user.posts?.length || 0}
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

          {/* Posts Section */}
          <motion.div className="space-y-6">
            <div className="flex border-b">
              <button className="flex-1 py-2 font-medium border-b-2 border-primary text-primary">
                Published
              </button>
              <button className="flex-1 py-2 font-medium text-muted-foreground">
                Drafts
              </button>
            </div>

            <div className="space-y-6">
              {user.posts?.length > 0 ? (
                user.posts.map((post: IPost, index: number) => {
                  // Safely handle post data with fallbacks
                  const postData = {
                    ...post,
                    postTags: post.postTags || [],
                    postLikes: post.postLikes || [],
                    postComments: post.postComments || [],
                    createdAt: post.createdAt || new Date(),
                  };

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={user.avatar || undefined}
                                alt={user.name}
                              />
                              <AvatarFallback>{avatarFallback}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                  {user.name}
                                </span>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    postData.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <h3 className="text-xl font-semibold hover:text-primary cursor-pointer transition-colors">
                            {postData.postTitle}
                          </h3>

                          {postData.postDescription && (
                            <div
                              className="text-muted-foreground line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: postData.postDescription,
                              }}
                            />
                          )}

                          {postData.postTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {postData.postTags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                                {postData.postLikes.length}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                {postData.postComments.length}
                              </motion.button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No published posts yet
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
