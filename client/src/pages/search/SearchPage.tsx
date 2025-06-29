import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  User,
  FileText,
  Tag,
  X,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock data types
interface SearchResult {
  type: 'post' | 'user' | 'tag';
  id: string;
  // Post fields
  postTitle?: string;
  postDescription?: string;
  postBannerImage?: string;
  postTags?: string[];
  createdAt?: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
    userName?: string;
  };
  postLikes?: { id: string }[];
  postComments?: { id: string }[];
  isLiked?: boolean;
  // User fields
  name?: string;
  userName?: string;
  avatar?: string;
  bio?: string;
  followersCount?: number;
  postsCount?: number;
  tagName?: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'posts' | 'users' | 'tags'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock empty search results
    const mockResults: SearchResult[] = [];

    setSearchResults(mockResults);
    setLoading(false);
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setSearchResults([]);
    setHasSearched(false);
  };

  const filteredResults = searchResults.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'posts') return result.type === 'post';
    if (activeFilter === 'users') return result.type === 'user';
    if (activeFilter === 'tags') return result.type === 'tag';
    return true;
  });

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

  const SearchSkeleton = () => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl">
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );

  const PostResult = ({ result }: { result: SearchResult }) => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0 cursor-pointer group">
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
            <AvatarImage
              src={result.creator?.avatar ?? undefined}
              alt="avatar-image"
            />
            <AvatarFallback className="text-sm font-bold text-foreground">
              {result.creator?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">
              {result.creator?.name}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{result.createdAt && formatDate(result.createdAt)}</span>
            </div>
          </div>
        </div>
        <div
          className={
            result.postBannerImage
              ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]"
              : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
          }
        >
          <div
            className={
              result.postBannerImage
                ? "h-full md:w-md xl:w-[500px] mb-2"
                : "mb-2"
            }
          >
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer group-hover:text-primary transition-colors">
              {result.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2">
              {result.postDescription}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {result.postTags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                  {tag}
                </Badge>
              ))}
              {result.postTags && result.postTags.length > 3 && (
                <Badge variant="outline" className="text-xs rounded-full">
                  +{result.postTags.length - 3}
                </Badge>
              )}
            </div>
          </div>
          {result.postBannerImage ? (
            <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
              <img
                src={result.postBannerImage ?? undefined}
                alt="post-image"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : null}
        </div>
        <div className="flex items-center h-6 justify-between mt-3">
          <div className="flex gap-4 mx-1">
            <div className="flex gap-1 items-center">
              <Heart className={cn("size-5", result.isLiked ? "text-red-500 fill-current" : "text-muted-foreground")} />
              <h1 className="text-sm font-medium text-muted-foreground">
                {result.postLikes?.length || 0}
              </h1>
              <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {(result.postLikes?.length || 0) > 1 ? "likes" : "like"}
              </h1>
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle className="size-5 text-muted-foreground" />
              <h1 className="text-sm font-medium text-muted-foreground">
                {result.postComments?.length || 0}
              </h1>
              <h1 className="hidden lg:flex text-sm font-medium text-muted-foreground">
                {(result.postComments?.length || 0) > 1 ? "comments" : "comment"}
              </h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bookmark className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const UserResult = ({ result }: { result: SearchResult }) => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0 cursor-pointer">
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="size-12 rounded-full border border-border">
              <AvatarImage src={result.avatar ?? undefined} alt="avatar-image" />
              <AvatarFallback className="text-sm font-bold text-foreground">
                {result.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{result.name}</h3>
              <p className="text-sm text-muted-foreground">@{result.userName}</p>
              {result.bio && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-md">
                  {result.bio}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span>{result.followersCount} followers</span>
                <span>{result.postsCount} posts</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TagResult = ({ result }: { result: SearchResult }) => (
    <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-shadow py-0 cursor-pointer">
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Tag className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">#{result.tagName}</h3>
              <p className="text-sm text-muted-foreground">
                {result.postsCount} posts
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl overflow-y-auto" style={{ height: "100vh", scrollbarWidth: "none" }}>
        {/* Search Form */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search posts, users, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 rounded-xl border-border focus:border-primary"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Filter Tabs - Only show if there are results */}
        {searchResults.length > 0 && (
          <div className="flex space-x-1 mb-5 justify-between items-center">
            <div className="flex">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                onClick={() => setActiveFilter("all")}
                className={`flex items-center mr-2 rounded-xl space-x-2 ${
                  activeFilter === "all"
                    ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="size-5 hidden md:flex" />
                <span className="text-sm">All</span>
              </Button>
              <Button
                variant={activeFilter === "posts" ? "default" : "ghost"}
                onClick={() => setActiveFilter("posts")}
                className={`flex items-center mr-2 rounded-xl space-x-2 ${
                  activeFilter === "posts"
                    ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-5 hidden md:flex" />
                <span className="text-sm">Posts</span>
              </Button>
              <Button
                variant={activeFilter === "users" ? "default" : "ghost"}
                onClick={() => setActiveFilter("users")}
                className={`flex items-center mr-2 rounded-xl space-x-2 ${
                  activeFilter === "users"
                    ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="size-5 hidden md:flex" />
                <span className="text-sm">Users</span>
              </Button>
              <Button
                variant={activeFilter === "tags" ? "default" : "ghost"}
                onClick={() => setActiveFilter("tags")}
                className={`flex items-center rounded-xl space-x-2 ${
                  activeFilter === "tags"
                    ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tag className="size-5 hidden md:flex" />
                <span className="text-sm">Tags</span>
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SearchSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hasSearched && filteredResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16 flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground/60" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">No data found</h3>
            <p className="text-muted-foreground mb-8 max-w-md text-center leading-relaxed">
              We couldn't find any results for "{searchQuery}". Try searching with different keywords or check your spelling.
            </p>
            <Button onClick={handleClearSearch} variant="outline" className="rounded-xl px-6 py-2">
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground/60" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Search FeedNest</h3>
            <p className="text-muted-foreground mb-8 max-w-md text-center leading-relaxed">
              Discover posts, users, and topics that interest you. Start typing to search across all content.
            </p>
          </motion.div>
        )}

        {/* Search Results */}
        {!loading && filteredResults.length > 0 && (
          <div className="space-y-6">
            {filteredResults.map((result, index) => (
              <motion.div
                key={`${result.type}-${result.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {result.type === 'post' && <PostResult result={result} />}
                {result.type === 'user' && <UserResult result={result} />}
                {result.type === 'tag' && <TagResult result={result} />}
              </motion.div>
            ))}

            <div className="text-center py-4 text-muted-foreground">
              You've reached the end of search results
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;