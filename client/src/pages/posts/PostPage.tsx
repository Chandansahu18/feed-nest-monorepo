import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Calendar,
  User,
  Tag,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserData } from "@/hooks/useUserData";

interface PostData {
  id: string;
  postTitle: string;
  postDescription: string;
  postBannerImage?: string;
  postTags: string[];
  published: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    userName: string;
    avatar?: string;
    bio?: string;
  };
  postLikes: any[];
  postComments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Comment {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    userName: string;
    avatar?: string;
  };
}

const PostPage = () => {
  const { postid } = useParams();
  const navigate = useNavigate();
  const { data: currentUserData } = useUserData();
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock post data
      const mockPost: PostData = {
        id: postid || "1",
        postTitle: "Building Modern React Applications with TypeScript: A Complete Guide",
        postDescription: `
          <h2>Introduction</h2>
          <p>React and TypeScript have become the go-to combination for building modern, scalable web applications. In this comprehensive guide, we'll explore how to leverage the power of both technologies to create maintainable and robust applications.</p>
          
          <h3>Why TypeScript with React?</h3>
          <p>TypeScript brings static typing to JavaScript, which provides several benefits when working with React:</p>
          <ul>
            <li><strong>Better Developer Experience:</strong> Enhanced IDE support with autocomplete and error detection</li>
            <li><strong>Catch Errors Early:</strong> Type checking helps identify issues during development</li>
            <li><strong>Improved Refactoring:</strong> Safe refactoring with confidence</li>
            <li><strong>Better Documentation:</strong> Types serve as living documentation</li>
          </ul>

          <h3>Setting Up Your Project</h3>
          <p>Let's start by creating a new React project with TypeScript support:</p>
          <pre><code>npx create-react-app my-app --template typescript</code></pre>
          
          <p>This command creates a new React application with TypeScript configuration out of the box.</p>

          <h3>Component Patterns</h3>
          <p>Here are some essential patterns when working with React and TypeScript:</p>
          
          <h4>1. Functional Components with Props</h4>
          <pre><code>interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};</code></pre>

          <h4>2. State Management with useState</h4>
          <pre><code>const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);</code></pre>

          <h3>Best Practices</h3>
          <p>Follow these best practices for a better development experience:</p>
          <ol>
            <li><strong>Use strict TypeScript configuration</strong> - Enable strict mode in tsconfig.json</li>
            <li><strong>Define interfaces for props</strong> - Always type your component props</li>
            <li><strong>Use generic types</strong> - Leverage TypeScript generics for reusable components</li>
            <li><strong>Avoid 'any' type</strong> - Be specific with your types</li>
          </ol>

          <h3>Conclusion</h3>
          <p>TypeScript and React make a powerful combination for building modern web applications. The initial setup might seem complex, but the long-term benefits in terms of maintainability, developer experience, and code quality are substantial.</p>
          
          <p>Start small, gradually adopt TypeScript patterns, and you'll soon find yourself writing more confident and reliable React code.</p>
        `,
        postBannerImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200",
        postTags: ["React", "TypeScript", "Frontend", "JavaScript", "Web Development"],
        published: true,
        createdAt: "2024-01-15T10:30:00Z",
        creator: {
          id: "user123",
          name: "Sarah Johnson",
          userName: "sarahdev",
          avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
          bio: "Full-stack developer passionate about React and TypeScript"
        },
        postLikes: Array.from({ length: 42 }, (_, i) => ({ id: `like-${i}` })),
        postComments: [
          {
            id: "1",
            comment: "Great article! Really helped me understand TypeScript with React better.",
            createdAt: "2024-01-15T12:30:00Z",
            user: {
              id: "user456",
              name: "Alex Chen",
              userName: "alexdev",
              avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          },
          {
            id: "2",
            comment: "The component patterns section is particularly useful. Thanks for sharing!",
            createdAt: "2024-01-15T14:20:00Z",
            user: {
              id: "user789",
              name: "Maria Rodriguez",
              userName: "mariacode",
              avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          }
        ],
        isLiked: false,
        isBookmarked: false
      };
      
      setPostData(mockPost);
      setIsLiked(mockPost.isLiked);
      setIsBookmarked(mockPost.isBookmarked);
      setLikesCount(mockPost.postLikes.length);
      setLoading(false);
    };

    fetchPost();
  }, [postid]);

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
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: postData?.postTitle,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const isOwnPost = currentUserData?.data?.id === postData?.creator.id;

  const PostSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center space-x-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl" style={{ minWidth: "320px" }}>
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl">
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl" style={{ minWidth: "320px" }}>
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl" style={{ minWidth: "320px" }}>
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 rounded-xl hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Post Content */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar 
                    className="size-12 cursor-pointer"
                    onClick={() => navigate(`/${postData.creator.userName}`)}
                  >
                    <AvatarImage src={postData.creator.avatar} alt="Author avatar" />
                    <AvatarFallback className="text-sm font-bold">
                      {postData.creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/${postData.creator.userName}`)}
                    >
                      {postData.creator.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>@{postData.creator.userName}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(postData.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isOwnPost ? (
                      <>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem className="cursor-pointer">
                          <Flag className="w-4 h-4 mr-2" />
                          Report Post
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Post Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {postData.postTitle}
              </h1>

              {/* Post Tags */}
              {postData.postTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {postData.postTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full cursor-pointer hover:bg-accent">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Banner Image */}
              {postData.postBannerImage && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={postData.postBannerImage}
                      alt="Post banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Post Content */}
              <div 
                className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: postData.postDescription }}
              />

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex gap-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likesCount}</span>
                    <span className="hidden sm:inline">
                      {likesCount === 1 ? 'like' : 'likes'}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 text-muted-foreground hover:text-blue-500"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{postData.postComments.length}</span>
                    <span className="hidden sm:inline">
                      {postData.postComments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">1.2k</span>
                    <span className="hidden sm:inline">views</span>
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className={`rounded-xl transition-all duration-200 hover:scale-110 ${
                      isBookmarked ? 'text-blue-600 hover:text-blue-700' : 'text-muted-foreground hover:text-blue-600'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="rounded-xl transition-all duration-200 hover:scale-110 text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Comments ({postData.postComments.length})
              </h3>
              
              {postData.postComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {postData.postComments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar 
                        className="size-8 cursor-pointer"
                        onClick={() => navigate(`/${comment.user.userName}`)}
                      >
                        <AvatarImage src={comment.user.avatar} alt="Commenter avatar" />
                        <AvatarFallback className="text-xs font-bold">
                          {comment.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 
                            className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                            onClick={() => navigate(`/${comment.user.userName}`)}
                          >
                            {comment.user.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            @{comment.user.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Posts or Author Info */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <Avatar 
                  className="size-16 cursor-pointer"
                  onClick={() => navigate(`/${postData.creator.userName}`)}
                >
                  <AvatarImage src={postData.creator.avatar} alt="Author avatar" />
                  <AvatarFallback className="text-lg font-bold">
                    {postData.creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 
                    className="font-semibold cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/${postData.creator.userName}`)}
                  >
                    {postData.creator.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">@{postData.creator.userName}</p>
                  {postData.creator.bio && (
                    <p className="text-sm leading-relaxed mb-3">{postData.creator.bio}</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl"
                    onClick={() => navigate(`/${postData.creator.userName}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PostPage;