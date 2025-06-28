import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bookmark, 
  BookmarkX, 
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock data types (replace with actual API types)
interface BookmarkedPost {
  id: string;
  postTitle: string;
  postDescription: string;
  postBannerImage?: string;
  postTags: string[];
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
    userName?: string;
  };
  postLikes: { id: string }[];
  postComments: { id: string }[];
  isLiked: boolean;
}

const BookmarkedPostsPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BookmarkedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts: BookmarkedPost[] = [
        {
          id: "1",
          postTitle: "Building Modern React Applications with TypeScript",
          postDescription: "Learn how to create scalable and maintainable React applications using TypeScript. This comprehensive guide covers best practices, advanced patterns, and real-world examples that will help you build better applications.",
          postBannerImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          postTags: ["React", "TypeScript", "Frontend"],
          createdAt: "2024-01-15T10:30:00Z",
          creator: {
            id: "user1",
            name: "Sarah Johnson",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "sarahdev"
          },
          postLikes: Array.from({ length: 42 }, (_, i) => ({ id: `like-${i}` })),
          postComments: Array.from({ length: 8 }, (_, i) => ({ id: `comment-${i}` })),
          isLiked: true
        },
        {
          id: "2",
          postTitle: "The Future of Web Development: Trends to Watch",
          postDescription: "Explore the latest trends and technologies shaping the future of web development. From AI integration to new frameworks, discover what's coming next in the world of web development.",
          postBannerImage: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          postTags: ["Web Development", "AI", "Future Tech"],
          createdAt: "2024-01-12T14:20:00Z",
          creator: {
            id: "user2",
            name: "Alex Chen",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "alextech"
          },
          postLikes: Array.from({ length: 67 }, (_, i) => ({ id: `like-${i}` })),
          postComments: Array.from({ length: 15 }, (_, i) => ({ id: `comment-${i}` })),
          isLiked: false
        },
        {
          id: "3",
          postTitle: "Mastering CSS Grid and Flexbox for Modern Layouts",
          postDescription: "A deep dive into CSS Grid and Flexbox, showing you how to create responsive and flexible layouts that work across all devices and screen sizes.",
          postTags: ["CSS", "Layout", "Responsive Design"],
          createdAt: "2024-01-10T09:15:00Z",
          creator: {
            id: "user3",
            name: "Maria Rodriguez",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "mariacss"
          },
          postLikes: Array.from({ length: 28 }, (_, i) => ({ id: `like-${i}` })),
          postComments: Array.from({ length: 5 }, (_, i) => ({ id: `comment-${i}` })),
          isLiked: true
        },
        {
          id: "4",
          postTitle: "Advanced JavaScript Patterns and Best Practices",
          postDescription: "Discover advanced JavaScript patterns that will make your code more maintainable and efficient. Learn about design patterns, functional programming concepts, and modern ES6+ features.",
          postBannerImage: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          postTags: ["JavaScript", "Patterns", "Best Practices"],
          createdAt: "2024-01-08T16:45:00Z",
          creator: {
            id: "user4",
            name: "David Kim",
            avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "davidjs"
          },
          postLikes: Array.from({ length: 35 }, (_, i) => ({ id: `like-${i}` })),
          postComments: Array.from({ length: 12 }, (_, i) => ({ id: `comment-${i}` })),
          isLiked: false
        }
      ];
      
      setBookmarkedPosts(mockPosts);
      
      if (postId) {
        const post = mockPosts.find(p => p.id === postId);
        setSelectedPost(post || null);
      }
      
      setLoading(false);
    };

    fetchBookmarkedPosts();
  }, [postId]);

  const handleRemoveBookmark = async (postIdToRemove: string) => {
    setRemovingBookmark(postIdToRemove);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setBookmarkedPosts(prev => prev.filter(post => post.id !== postIdToRemove));
    setRemovingBookmark(null);
    
    // If we're viewing the specific post that was removed, go back to list
    if (postId === postIdToRemove) {
      navigate('/bookmarks');
    }
  };

  const handlePostClick = (post: BookmarkedPost) => {
    navigate(`/bookmarks/${post.id}`);
  };

  const handleBackToList = () => {
    navigate('/bookmarks');
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return postDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
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

  if (loading) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto" style={{ height: "100vh", scrollbarWidth: "none" }}>
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

  // Single post view
  if (postId && selectedPost) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto" style={{ height: "100vh", scrollbarWidth: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={handleBackToList}
              className="mb-6 hover:bg-accent rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookmarks
            </Button>

            <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl overflow-hidden">
              {selectedPost.postBannerImage && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={selectedPost.postBannerImage}
                    alt={selectedPost.postTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              <CardContent className="py-6 max-[375px]:px-0 lg:px-6">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                      {selectedPost.postTitle}
                    </h1>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
                        <AvatarImage
                          src={selectedPost.creator.avatar ?? undefined}
                          alt="avatar-image"
                        />
                        <AvatarFallback className="text-sm font-bold text-foreground">
                          {selectedPost.creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {selectedPost.creator.name}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatDate(selectedPost.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedPost.postTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {selectedPost.postDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex gap-4 mx-1">
                      <div className="flex gap-1 items-center">
                        <Heart className={cn("size-5", selectedPost.isLiked ? "text-red-500 fill-current" : "text-muted-foreground")} />
                        <h1 className="text-sm font-medium text-muted-foreground">
                          {selectedPost.postLikes.length}
                        </h1>
                        <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                          {selectedPost.postLikes.length > 1 ? "likes" : "like"}
                        </h1>
                      </div>
                      <div className="flex gap-1 items-center">
                        <MessageCircle className="size-5 text-muted-foreground" />
                        <h1 className="text-sm font-medium text-muted-foreground">
                          {selectedPost.postComments.length}
                        </h1>
                        <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                          {selectedPost.postComments.length > 1 ? "comments" : "comment"}
                        </h1>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Share2 className="size-5" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBookmark(selectedPost.id)}
                      disabled={removingBookmark === selectedPost.id}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      {removingBookmark === selectedPost.id ? (
                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <BookmarkX className="size-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto" style={{ height: "100vh", scrollbarWidth: "none" }}>
        <div className="flex space-x-1 mb-5 justify-between items-center">
          <div className="flex">
            <Button
              variant={activeFilter === "All" ? "default" : "ghost"}
              onClick={() => setActiveFilter("All")}
              className={`flex items-center mr-2 rounded-xl space-x-2 ${
                activeFilter === "All"
                  ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="size-5 hidden md:flex" />
              <span className="text-sm">All Bookmarks</span>
            </Button>
            <Button
              variant={activeFilter === "Recent" ? "default" : "ghost"}
              onClick={() => setActiveFilter("Recent")}
              className={`flex items-center rounded-xl space-x-2 ${
                activeFilter === "Recent"
                  ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Filter className="size-5 hidden md:flex" />
              <span className="text-sm">Recent</span>
            </Button>
          </div>
        </div>

        {bookmarkedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6">
              Start bookmarking posts to see them here
            </p>
            <Button onClick={() => navigate('/')} className="rounded-xl">
              <Eye className="w-4 h-4 mr-2" />
              Explore Posts
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookmarkedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0 cursor-pointer group">
                  <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0" onClick={() => handlePostClick(post)}>
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
                        <AvatarImage
                          src={post.creator.avatar ?? undefined}
                          alt="avatar-image"
                        />
                        <AvatarFallback className="text-sm font-bold text-foreground">
                          {post.creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {post.creator.name}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatDate(post.createdAt)}</span>
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
                        <p className="text-muted-foreground line-clamp-2">
                          {post.postDescription}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.postTags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs rounded-full">
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
                      {post.postBannerImage ? (
                        <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
                          <img
                            src={post.postBannerImage ?? undefined}
                            alt="post-image"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center h-6 justify-between mt-3">
                      <div className="flex gap-4 mx-1">
                        <div className="flex gap-1 items-center">
                          <Heart className={cn("size-5", post.isLiked ? "text-red-500 fill-current" : "text-muted-foreground")} />
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
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBookmark(post.id);
                        }}
                        disabled={removingBookmark === post.id}
                      >
                        {removingBookmark === post.id ? (
                          <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <BookmarkX className="size-5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {bookmarkedPosts.length > 0 && (
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