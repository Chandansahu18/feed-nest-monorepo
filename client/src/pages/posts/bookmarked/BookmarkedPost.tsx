import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  BookmarkX,
  Share2,
  Calendar,
  User,
  Tag,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Clock,
  ExternalLink
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

interface BookmarkedPostData {
  id: string;
  postTitle: string;
  postDescription: string;
  postBannerImage?: string;
  postTags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  bookmarkedAt: string;
  creator: {
    id: string;
    name: string;
    userName: string;
    avatar?: string;
    bio?: string;
    location?: string;
  };
  postLikes: any[];
  postComments: Comment[];
  isLiked: boolean;
  viewCount: number;
  readTime: number;
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

const BookmarkedPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: currentUserData } = useUserData();
  const [postData, setPostData] = useState<BookmarkedPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true); // Always true for bookmarked posts
  const [likesCount, setLikesCount] = useState(0);
  const [removingBookmark, setRemovingBookmark] = useState(false);

  useEffect(() => {
    const fetchBookmarkedPost = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock bookmarked post data
      const mockPost: BookmarkedPostData = {
        id: postId || "1",
        postTitle: "Mastering CSS Grid and Flexbox for Modern Layouts",
        postDescription: `
          <div class="post-content">
            <h2>Introduction to Modern CSS Layout</h2>
            <p>CSS Grid and Flexbox have revolutionized how we approach web layouts. These powerful layout systems provide developers with unprecedented control over positioning, alignment, and responsive design. In this comprehensive guide, we'll explore both technologies and learn when and how to use them effectively.</p>
            
            <blockquote>
              <p>"CSS Grid and Flexbox are not competing layout methods. They complement each other perfectly." - Rachel Andrew, CSS Expert</p>
            </blockquote>

            <h3>Understanding CSS Flexbox</h3>
            <p>Flexbox, or the Flexible Box Layout, is designed for one-dimensional layouts. It excels at distributing space and aligning items within a container, whether horizontally or vertically.</p>
            
            <h4>Key Flexbox Concepts:</h4>
            <ul>
              <li><strong>Flex Container:</strong> The parent element with <code>display: flex</code></li>
              <li><strong>Flex Items:</strong> Direct children of the flex container</li>
              <li><strong>Main Axis:</strong> The primary axis along which flex items are laid out</li>
              <li><strong>Cross Axis:</strong> The axis perpendicular to the main axis</li>
            </ul>

            <h4>Essential Flexbox Properties:</h4>
            <pre><code>.flex-container {
  display: flex;
  justify-content: space-between; /* Main axis alignment */
  align-items: center; /* Cross axis alignment */
  flex-wrap: wrap; /* Allow items to wrap */
  gap: 1rem; /* Space between items */
}

.flex-item {
  flex: 1; /* Grow and shrink equally */
  flex-basis: 200px; /* Initial size */
}</code></pre>

            <h3>Mastering CSS Grid</h3>
            <p>CSS Grid is a two-dimensional layout system that allows you to work with both rows and columns simultaneously. It's perfect for creating complex layouts with precise control.</p>

            <h4>Grid Fundamentals:</h4>
            <pre><code>.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-rows: auto 1fr auto; /* Header, content, footer */
  grid-gap: 20px; /* Space between grid items */
  min-height: 100vh;
}

.header {
  grid-column: 1 / -1; /* Span all columns */
}

.sidebar {
  grid-row: 2; /* Second row */
}

.main-content {
  grid-column: 2 / -1; /* Span from column 2 to end */
}</code></pre>

            <h4>Advanced Grid Techniques:</h4>
            <ul>
              <li><strong>Grid Areas:</strong> Named regions for semantic layouts</li>
              <li><strong>Auto-placement:</strong> Let the browser position items automatically</li>
              <li><strong>Subgrid:</strong> Inherit grid lines from parent containers</li>
              <li><strong>Implicit grids:</strong> Automatically created rows and columns</li>
            </ul>

            <h3>Responsive Design with Grid and Flexbox</h3>
            <p>Both Grid and Flexbox offer powerful responsive capabilities without requiring media queries in many cases.</p>

            <h4>Responsive Grid Example:</h4>
            <pre><code>.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Cards automatically wrap to new rows as needed */
.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}</code></pre>

            <h4>Responsive Flexbox Navigation:</h4>
            <pre><code>.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
    text-align: center;
  }
}</code></pre>

            <h3>When to Use Grid vs Flexbox</h3>
            
            <h4>Use Flexbox for:</h4>
            <ul>
              <li>Navigation bars and menus</li>
              <li>Centering content vertically and horizontally</li>
              <li>Distributing space between items</li>
              <li>One-dimensional layouts (either rows or columns)</li>
              <li>Component-level layouts</li>
            </ul>

            <h4>Use Grid for:</h4>
            <ul>
              <li>Page-level layouts</li>
              <li>Two-dimensional layouts (rows and columns)</li>
              <li>Complex, overlapping designs</li>
              <li>When you need precise control over placement</li>
              <li>Creating responsive layouts without media queries</li>
            </ul>

            <h3>Practical Examples</h3>
            
            <h4>Holy Grail Layout with Grid:</h4>
            <pre><code>.holy-grail {
  display: grid;
  grid-template-areas: 
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 200px;
  min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }</code></pre>

            <h4>Card Layout with Flexbox:</h4>
            <pre><code>.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.card {
  flex: 0 1 300px; /* Don't grow, can shrink, base width 300px */
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1; /* Take up remaining space */
}

.card-actions {
  margin-top: auto; /* Push to bottom */
}</code></pre>

            <h3>Browser Support and Fallbacks</h3>
            <p>Both Grid and Flexbox have excellent modern browser support. However, for older browsers, consider these strategies:</p>

            <ul>
              <li><strong>Progressive Enhancement:</strong> Start with basic layouts, enhance with Grid/Flexbox</li>
              <li><strong>Feature Queries:</strong> Use <code>@supports</code> to detect Grid/Flexbox support</li>
              <li><strong>Graceful Degradation:</strong> Provide fallbacks using floats or inline-block</li>
            </ul>

            <h4>Feature Query Example:</h4>
            <pre><code>/* Fallback layout */
.item {
  float: left;
  width: 33.333%;
}

/* Enhanced layout for Grid-supporting browsers */
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  
  .item {
    float: none;
    width: auto;
  }
}</code></pre>

            <h3>Performance Considerations</h3>
            <p>Both Grid and Flexbox are highly optimized by modern browsers, but keep these tips in mind:</p>

            <ul>
              <li>Avoid unnecessary nesting of flex/grid containers</li>
              <li>Use <code>will-change</code> sparingly for animated layouts</li>
              <li>Consider <code>content-visibility</code> for large grids</li>
              <li>Test performance on lower-end devices</li>
            </ul>

            <h3>Conclusion</h3>
            <p>CSS Grid and Flexbox are powerful tools that, when used together, can handle virtually any layout challenge. Grid excels at page-level, two-dimensional layouts, while Flexbox is perfect for component-level, one-dimensional arrangements.</p>
            
            <p>The key is understanding when to use each technology and how they can work together to create responsive, maintainable layouts. Start experimenting with both, and you'll quickly discover how they can transform your approach to CSS layout.</p>

            <p>Remember: there's no "wrong" choice between Grid and Flexbox – often, the best solution uses both technologies where they each shine brightest.</p>
          </div>
        `,
        postBannerImage: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200",
        postTags: ["CSS", "Grid", "Flexbox", "Layout", "Responsive Design", "Frontend"],
        published: true,
        createdAt: "2024-01-10T09:15:00Z",
        updatedAt: "2024-01-10T09:15:00Z",
        bookmarkedAt: "2024-01-16T14:30:00Z",
        creator: {
          id: "user456",
          name: "Maria Rodriguez",
          userName: "mariacss",
          avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
          bio: "CSS specialist and frontend architect. Passionate about creating beautiful, accessible web experiences. Author of 'Modern CSS Layouts'.",
          location: "Barcelona, Spain"
        },
        postLikes: Array.from({ length: 89 }, (_, i) => ({ id: `like-${i}` })),
        postComments: [
          {
            id: "1",
            comment: "This is exactly what I needed! The Grid vs Flexbox comparison is so helpful. I've been struggling with when to use which, and this clears it up perfectly.",
            createdAt: "2024-01-10T11:30:00Z",
            user: {
              id: "user789",
              name: "David Kim",
              userName: "davidjs",
              avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          },
          {
            id: "2",
            comment: "The Holy Grail layout example is brilliant! I've been using floats for years and this Grid approach is so much cleaner. Thanks for the detailed explanation!",
            createdAt: "2024-01-10T13:45:00Z",
            user: {
              id: "user101",
              name: "Sarah Chen",
              userName: "sarahdev",
              avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          }
        ],
        isLiked: true,
        viewCount: 1456,
        readTime: 8
      };
      
      setPostData(mockPost);
      setIsLiked(mockPost.isLiked);
      setLikesCount(mockPost.postLikes.length);
      setLoading(false);
    };

    fetchBookmarkedPost();
  }, [postId]);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRemoveBookmark = async () => {
    setRemovingBookmark(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsBookmarked(false);
    setRemovingBookmark(false);
    
    // Navigate back to bookmarks list after removal
    navigate('/bookmarks');
  };

  const handleShare = async () => {
    if (navigator.share && postData) {
      try {
        await navigator.share({
          title: postData.postTitle,
          text: postData.postDescription.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
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
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
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
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ExternalLink className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Bookmarked post not found</h2>
          <p className="text-muted-foreground mb-6">The bookmarked post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/bookmarks')} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookmarks
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
            onClick={() => navigate('/bookmarks')}
            className="mb-4 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookmarks
          </Button>

          {/* Bookmark Status Banner */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-current" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Bookmarked Post</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Saved on {formatDate(postData.bookmarkedAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveBookmark}
                  disabled={removingBookmark}
                  className="text-blue-700 dark:text-blue-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  {removingBookmark ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <BookmarkX className="w-4 h-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">
                    {removingBookmark ? 'Removing...' : 'Remove'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border overflow-hidden">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar 
                    className="size-12 sm:size-14 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200"
                    onClick={() => navigate(`/${postData.creator.userName}`)}
                  >
                    <AvatarImage src={postData.creator.avatar} alt="Author avatar" />
                    <AvatarFallback className="text-sm font-bold">
                      {postData.creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-semibold text-base sm:text-lg cursor-pointer hover:text-primary transition-colors truncate"
                      onClick={() => navigate(`/${postData.creator.userName}`)}
                    >
                      {postData.creator.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                      <span className="truncate">@{postData.creator.userName}</span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(postData.createdAt)}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{postData.readTime} min read</span>
                      </div>
                    </div>
                    {postData.creator.location && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        📍 {postData.creator.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Post Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105">
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => navigate(`/${postData.creator.userName}`)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600"
                          onClick={handleRemoveBookmark}
                        >
                          <BookmarkX className="w-4 h-4 mr-2" />
                          Remove Bookmark
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Flag className="w-4 h-4 mr-2" />
                          Report Post
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Post Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                {postData.postTitle}
              </h1>

              {/* Post Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(postData.viewCount)} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{formatNumber(likesCount)} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{postData.postComments.length} comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bookmark className="w-4 h-4 text-blue-600 fill-current" />
                  <span className="text-blue-600 font-medium">Bookmarked</span>
                </div>
              </div>

              {/* Post Tags */}
              {postData.postTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {postData.postTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="rounded-full cursor-pointer hover:bg-accent transition-all duration-200 hover:scale-105"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Banner Image */}
              {postData.postBannerImage && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={postData.postBannerImage}
                      alt="Post banner"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Post Content */}
              <div 
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: postData.postDescription }}
                style={{
                  lineHeight: '1.7',
                  fontSize: '16px'
                }}
              />

              {/* Post Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t gap-4">
                <div className="flex gap-4 sm:gap-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{formatNumber(likesCount)}</span>
                    <span className="hidden sm:inline text-sm">
                      {likesCount === 1 ? 'like' : 'likes'}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 text-muted-foreground hover:text-blue-500"
                    onClick={() => {
                      const commentsSection = document.getElementById('comments-section');
                      commentsSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{postData.postComments.length}</span>
                    <span className="hidden sm:inline text-sm">
                      {postData.postComments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">{formatNumber(postData.viewCount)}</span>
                    <span className="hidden sm:inline text-sm">views</span>
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveBookmark}
                    disabled={removingBookmark}
                    className="rounded-xl transition-all duration-200 hover:scale-110 text-blue-600 hover:text-red-600"
                  >
                    {removingBookmark ? (
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <BookmarkX className="w-5 h-5" />
                    )}
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

          {/* Author Info Card */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <Avatar 
                  className="size-16 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200"
                  onClick={() => navigate(`/${postData.creator.userName}`)}
                >
                  <AvatarImage src={postData.creator.avatar} alt="Author avatar" />
                  <AvatarFallback className="text-lg font-bold">
                    {postData.creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/${postData.creator.userName}`)}
                  >
                    {postData.creator.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">@{postData.creator.userName}</p>
                  {postData.creator.bio && (
                    <p className="text-sm leading-relaxed mb-4">{postData.creator.bio}</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl transition-all duration-200 hover:scale-105"
                    onClick={() => navigate(`/${postData.creator.userName}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card 
            id="comments-section"
            className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border"
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Comments ({postData.postComments.length})
              </h3>
              
              {postData.postComments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium mb-2">No comments yet</h4>
                  <p className="text-muted-foreground text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {postData.postComments.map((comment, index) => (
                    <motion.div 
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex space-x-3 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-200"
                    >
                      <Avatar 
                        className="size-10 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200"
                        onClick={() => navigate(`/${comment.user.userName}`)}
                      >
                        <AvatarImage src={comment.user.avatar} alt="Commenter avatar" />
                        <AvatarFallback className="text-xs font-bold">
                          {comment.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <h4 
                            className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                            onClick={() => navigate(`/${comment.user.userName}`)}
                          >
                            {comment.user.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            @{comment.user.userName}
                          </span>
                          <span className="hidden sm:inline text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{comment.comment}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BookmarkedPost;