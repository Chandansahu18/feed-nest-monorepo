import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

interface PostData {
  id: string;
  postTitle: string;
  postDescription: string;
  postBannerImage?: string;
  postTags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
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
  isBookmarked: boolean;
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

const PostPage = () => {
  const { state } = useLocation();
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
        id: state.postTitle || "1",
        postTitle: "Building Modern React Applications with TypeScript: A Complete Developer's Guide",
        postDescription: `
          <div class="post-content">
            <h2>Introduction</h2>
            <p>React and TypeScript have become the go-to combination for building modern, scalable web applications. In this comprehensive guide, we'll explore how to leverage the power of both technologies to create maintainable and robust applications that scale with your team and business needs.</p>
            
            <blockquote>
              <p>"TypeScript is JavaScript that scales" - Anders Hejlsberg, Creator of TypeScript</p>
            </blockquote>

            <h3>Why TypeScript with React?</h3>
            <p>TypeScript brings static typing to JavaScript, which provides several compelling benefits when working with React applications:</p>
            
            <ul>
              <li><strong>Enhanced Developer Experience:</strong> Superior IDE support with intelligent autocomplete, real-time error detection, and advanced refactoring capabilities</li>
              <li><strong>Early Error Detection:</strong> Catch type-related bugs during development rather than in production</li>
              <li><strong>Improved Code Quality:</strong> Enforce consistent coding patterns and prevent common JavaScript pitfalls</li>
              <li><strong>Better Collaboration:</strong> Types serve as living documentation for your team</li>
              <li><strong>Safer Refactoring:</strong> Confidently restructure code with compile-time guarantees</li>
            </ul>

            <h3>Setting Up Your Development Environment</h3>
            <p>Let's start by creating a new React project with TypeScript support. We'll use the official Create React App template:</p>
            
            <pre><code>npx create-react-app my-typescript-app --template typescript
cd my-typescript-app
npm start</code></pre>
            
            <p>This command creates a new React application with TypeScript configuration, ESLint rules, and testing setup out of the box.</p>

            <h4>Project Structure</h4>
            <p>Your project will have the following structure:</p>
            <pre><code>my-typescript-app/
├── src/
│   ├── components/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── public/
├── package.json
└── tsconfig.json</code></pre>

            <h3>Essential TypeScript Patterns for React</h3>
            
            <h4>1. Functional Components with Typed Props</h4>
            <p>Always define interfaces for your component props to ensure type safety:</p>
            
            <pre><code>interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  size = 'medium'
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  return (
    <button 
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};</code></pre>

            <h4>2. State Management with Proper Typing</h4>
            <p>Use TypeScript's generic types with React hooks for better type inference:</p>
            
            <pre><code>interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user');
        const userData: User = await response.json();
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {user.avatar && <img src={user.avatar} alt="Avatar" />}
    </div>
  );
};</code></pre>

            <h4>3. Custom Hooks with TypeScript</h4>
            <p>Create reusable logic with properly typed custom hooks:</p>
            
            <pre><code>interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}</code></pre>

            <h3>Advanced Patterns and Best Practices</h3>
            
            <h4>1. Generic Components</h4>
            <p>Create flexible, reusable components using TypeScript generics:</p>
            
            <pre><code>interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) {
    return <div>{emptyMessage || 'No items found'}</div>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}</code></pre>

            <h4>2. Context API with TypeScript</h4>
            <p>Implement type-safe context for global state management:</p>
            
            <pre><code>interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};</code></pre>

            <h3>Testing TypeScript React Components</h3>
            <p>Write comprehensive tests for your TypeScript React components:</p>
            
            <pre><code>import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button onClick={() => {}} variant="danger">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-red-600');
  });
});</code></pre>

            <h3>Performance Optimization</h3>
            <p>TypeScript helps you write more performant React code:</p>
            
            <ul>
              <li><strong>Memoization:</strong> Use React.memo with proper prop typing</li>
              <li><strong>Callback Optimization:</strong> useCallback with dependency arrays</li>
              <li><strong>Bundle Analysis:</strong> TypeScript's tree-shaking capabilities</li>
              <li><strong>Code Splitting:</strong> Dynamic imports with proper typing</li>
            </ul>

            <h3>Common Pitfalls and How to Avoid Them</h3>
            
            <ol>
              <li><strong>Avoid 'any' type:</strong> Always strive for specific types</li>
              <li><strong>Use strict mode:</strong> Enable strict TypeScript configuration</li>
              <li><strong>Proper error handling:</strong> Type your error states</li>
              <li><strong>Component composition:</strong> Prefer composition over inheritance</li>
              <li><strong>Performance considerations:</strong> Be mindful of re-renders</li>
            </ol>

            <h3>Conclusion</h3>
            <p>TypeScript and React form a powerful combination for building modern web applications. The initial learning curve is worth the long-term benefits in terms of maintainability, developer experience, and code quality.</p>
            
            <p>Start by gradually introducing TypeScript to your existing React projects, focus on typing your props and state first, then expand to more advanced patterns as you become comfortable with the syntax and concepts.</p>

            <p>Remember: the goal isn't to have perfect types from day one, but to incrementally improve your codebase's type safety and developer experience over time.</p>
          </div>
        `,
        postBannerImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200",
        postTags: ["React", "TypeScript", "Frontend", "JavaScript", "Web Development", "Tutorial"],
        published: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        creator: {
          id: "user123",
          name: "Sarah Johnson",
          userName: "sarahdev",
          avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
          bio: "Full-stack developer passionate about React, TypeScript, and modern web technologies. Building scalable applications at @TechCorp.",
          location: "San Francisco, CA"
        },
        postLikes: Array.from({ length: 127 }, (_, i) => ({ id: `like-${i}` })),
        postComments: [
          {
            id: "1",
            comment: "Excellent comprehensive guide! The examples are really practical and easy to follow. I especially loved the custom hooks section - that's exactly what I needed for my current project.",
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
            comment: "The component patterns section is particularly useful. Thanks for sharing the testing examples too - that's often overlooked in tutorials!",
            createdAt: "2024-01-15T14:20:00Z",
            user: {
              id: "user789",
              name: "Maria Rodriguez",
              userName: "mariacode",
              avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          },
          {
            id: "3",
            comment: "Great article! I've been hesitant to adopt TypeScript but this makes it seem much more approachable. The generic components example was eye-opening.",
            createdAt: "2024-01-15T16:45:00Z",
            user: {
              id: "user101",
              name: "David Kim",
              userName: "davidjs",
              avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          }
        ],
        isLiked: false,
        isBookmarked: false,
        viewCount: 2847,
        readTime: 12
      };
      
      setPostData(mockPost);
      setIsLiked(mockPost.isLiked);
      setIsBookmarked(mockPost.isBookmarked);
      setLikesCount(mockPost.postLikes.length);
      setLoading(false);
    };

    fetchPost();
  }, [state.postTitle]);

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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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
            className="mb-4 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

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

export default PostPage;