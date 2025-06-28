import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bookmark, 
  BookmarkX, 
  Calendar, 
  User, 
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Eye
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
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

const BookmarkedPostsPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BookmarkedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts: BookmarkedPost[] = [
        {
          id: "1",
          postTitle: "Building Modern React Applications with TypeScript",
          postDescription: "Learn how to create scalable and maintainable React applications using TypeScript. This comprehensive guide covers best practices, advanced patterns, and real-world examples.",
          postBannerImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          postTags: ["React", "TypeScript", "Frontend"],
          createdAt: "2024-01-15T10:30:00Z",
          creator: {
            id: "user1",
            name: "Sarah Johnson",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "sarahdev"
          },
          likesCount: 42,
          commentsCount: 8,
          isLiked: true
        },
        {
          id: "2",
          postTitle: "The Future of Web Development: Trends to Watch",
          postDescription: "Explore the latest trends and technologies shaping the future of web development. From AI integration to new frameworks, discover what's coming next.",
          postBannerImage: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          postTags: ["Web Development", "AI", "Future Tech"],
          createdAt: "2024-01-12T14:20:00Z",
          creator: {
            id: "user2",
            name: "Alex Chen",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "alextech"
          },
          likesCount: 67,
          commentsCount: 15,
          isLiked: false
        },
        {
          id: "3",
          postTitle: "Mastering CSS Grid and Flexbox for Modern Layouts",
          postDescription: "A deep dive into CSS Grid and Flexbox, showing you how to create responsive and flexible layouts that work across all devices.",
          postTags: ["CSS", "Layout", "Responsive Design"],
          createdAt: "2024-01-10T09:15:00Z",
          creator: {
            id: "user3",
            name: "Maria Rodriguez",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
            userName: "mariacss"
          },
          likesCount: 28,
          commentsCount: 5,
          isLiked: true
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single post view
  if (postId && selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={handleBackToList}
              className="mb-6 hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookmarks
            </Button>

            <Card className="overflow-hidden border-0 shadow-lg">
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

              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                      {selectedPost.postTitle}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        {selectedPost.creator.avatar ? (
                          <img
                            src={selectedPost.creator.avatar}
                            alt={selectedPost.creator.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-medium text-foreground">
                          {selectedPost.creator.name}
                        </span>
                        {selectedPost.creator.userName && (
                          <span>@{selectedPost.creator.userName}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedPost.createdAt)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedPost.postTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed">
                      {selectedPost.postDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2",
                          selectedPost.isLiked && "text-red-500 hover:text-red-600"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", selectedPost.isLiked && "fill-current")} />
                        {selectedPost.likesCount}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {selectedPost.commentsCount}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBookmark(selectedPost.id)}
                      disabled={removingBookmark === selectedPost.id}
                      className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <BookmarkX className="w-4 h-4" />
                      {removingBookmark === selectedPost.id ? "Removing..." : "Remove Bookmark"}
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Your Bookmarks</h1>
            <p className="text-muted-foreground">
              {bookmarkedPosts.length} saved {bookmarkedPosts.length === 1 ? 'post' : 'posts'}
            </p>
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
              <Button onClick={() => navigate('/posts')}>
                <Eye className="w-4 h-4 mr-2" />
                Explore Posts
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {bookmarkedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div onClick={() => handlePostClick(post)}>
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {post.postTitle}
                          </h2>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveBookmark(post.id);
                            }}
                            disabled={removingBookmark === post.id}
                            className="shrink-0 ml-4 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            {removingBookmark === post.id ? (
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <BookmarkX className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          {post.creator.avatar ? (
                            <img
                              src={post.creator.avatar}
                              alt={post.creator.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {post.creator.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {post.creator.userName && (
                                <span>@{post.creator.userName}</span>
                              )}
                              <span>•</span>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {post.postBannerImage && (
                          <div className="relative h-48 rounded-lg overflow-hidden">
                            <img
                              src={post.postBannerImage}
                              alt={post.postTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.postDescription}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.postTags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.postTags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.postTags.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className={cn("w-4 h-4", post.isLiked && "fill-red-500 text-red-500")} />
                              {post.likesCount}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.commentsCount}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookmarkedPostsPage;