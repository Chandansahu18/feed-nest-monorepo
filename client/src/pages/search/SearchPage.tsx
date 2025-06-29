import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  FileText,
  Hash,
  ArrowLeft,
  Filter,
  SortAsc,
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import BlogsSkeleton from "@/components/home-page-section/blogsSkeleton";

interface SearchResult {
  id: string;
  type: "post" | "user" | "tag";
  data: any;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("All");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: "All", label: "All", icon: Search },
    { id: "Posts", label: "Posts", icon: FileText },
    { id: "People", label: "People", icon: Users },
    { id: "Tags", label: "Tags", icon: Hash },
  ];

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
    // Focus search input on mount
    searchInputRef.current?.focus();
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Simulate API call - replace with actual search API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "post",
          data: {
            id: "1",
            postTitle: "Getting Started with React and TypeScript",
            postDescription: "A comprehensive guide to building modern web applications with React and TypeScript. Learn best practices and advanced patterns.",
            postBannerImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
            postTags: ["react", "typescript", "javascript"],
            published: true,
            createdAt: new Date(),
            creator: {
              id: "1",
              name: "John Doe",
              userName: "johndoe",
              avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
            },
            postLikes: [1, 2, 3],
            postComments: [1, 2],
          }
        },
        {
          id: "2",
          type: "user",
          data: {
            id: "2",
            name: "Jane Smith",
            userName: "janesmith",
            bio: "Full-stack developer passionate about React and Node.js",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
            posts: [1, 2, 3, 4, 5],
            followingRelations: [1, 2],
          }
        },
        {
          id: "3",
          type: "tag",
          data: {
            name: "react",
            postCount: 156,
            description: "A JavaScript library for building user interfaces"
          }
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
      performSearch(searchTerm.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredResults = searchResults.filter(result => {
    if (activeTab === "All") return true;
    if (activeTab === "Posts") return result.type === "post";
    if (activeTab === "People") return result.type === "user";
    if (activeTab === "Tags") return result.type === "tag";
    return true;
  });

  const TabButton = ({ tab }: { tab: typeof tabs[0] }) => (
    <Button
      variant={activeTab === tab.id ? "default" : "ghost"}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center rounded-xl space-x-2 transition-all duration-200 ${
        activeTab === tab.id
          ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <tab.icon className="size-4" />
      <span className="text-sm">{tab.label}</span>
    </Button>
  );

  const PostCard = ({ post }: { post: any }) => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0">
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
            <AvatarImage src={post.creator.avatar} alt="avatar-image" />
            <AvatarFallback className="text-sm font-bold text-foreground">
              {post.creator.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.creator.name}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="size-3" />
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
            <p className="text-muted-foreground line-clamp-2 mb-2">{post.postDescription}</p>
            <div className="flex flex-wrap gap-2">
              {post.postTags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
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
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle className="size-5 text-muted-foreground transition-colors duration-200 hover:text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {post.postComments.length}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
          >
            <Bookmark className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const UserCard = ({ user }: { user: any }) => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="size-12 rounded-full border border-border flex items-center justify-center cursor-pointer">
              <AvatarImage src={user.avatar} alt="avatar-image" />
              <AvatarFallback className="text-lg font-bold text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.userName}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span>{user.posts.length} posts</span>
                <span>{user.followingRelations.length} following</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TagCard = ({ tag }: { tag: any }) => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
              <Hash className="size-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">#{tag.name}</h3>
              <p className="text-sm text-muted-foreground">{tag.postCount} posts</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tag.description}</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 mb-6 flex items-center justify-center bg-muted/50 rounded-full">
        <Search className="w-16 h-16 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasSearched ? "No results found" : "Start searching"}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {hasSearched 
          ? `We couldn't find anything for "${searchTerm}". Try different keywords or check your spelling.`
          : "Search for posts, people, or tags to discover amazing content."
        }
      </p>
    </div>
  );

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl h-full flex flex-col">
        {/* Header with search and navigation */}
        <div className="flex-shrink-0 bg-background border-b border-border/50 pb-4 mb-5">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="size-5" />
            </Button>
            
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search for posts, people, or tags..."
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </form>

            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Filter className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <SortAsc className="size-5" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} />
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto smooth-scroll" style={{ scrollbarWidth: "none" }}>
          <div className="space-y-6 pb-6">
            {/* Loading state */}
            {isLoading && <BlogsSkeleton />}

            {/* Empty state */}
            {!isLoading && filteredResults.length === 0 && <EmptyState />}

            {/* Search results */}
            {!isLoading && filteredResults.map((result) => {
              switch (result.type) {
                case "post":
                  return <PostCard key={result.id} post={result.data} />;
                case "user":
                  return <UserCard key={result.id} user={result.data} />;
                case "tag":
                  return <TagCard key={result.id} tag={result.data} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;