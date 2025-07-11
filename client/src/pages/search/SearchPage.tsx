import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  FileText,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import BlogsSkeleton from "@/components/home-page-section/blogsSkeleton";
import type { IPost, IPostData, ISearchData, IUser, IUserData } from "../../../../types/dist";
import { useSearchData } from "@/hooks/search/useSearchData";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const { data: searchedData, isPending } = useSearchData(debouncedSearchTerm);
  const [activeTab, setActiveTab] = useState("Posts");
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const tabs = [
    { id: "Posts", label: "Posts", icon: FileText },
    { id: "People", label: "People", icon: Users },
  ];

  const debouncedSearch = useCallback(
    (term: string) => {
      if (term.trim()) {
        setHasSearched(true);
        setDebouncedSearchTerm(term.trim());
        navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      } else {
        setDebouncedSearchTerm("");
        setHasSearched(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
      setDebouncedSearchTerm(query);
      setHasSearched(true);
    }
    searchInputRef.current?.focus();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debouncedSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      debouncedSearch(value);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const results = searchedData?.data || [];
  let filteredResults = results;
  if (activeTab === "Posts") {
    filteredResults = results.filter(
      (result:IPostData, index:number) =>
        results.findIndex(
          (r:IPost) =>
            r.postTitle === result.postTitle &&
            r.postDescription === result.postDescription &&
            r.createdAt === result.createdAt
        ) === index
    );
  } else if (activeTab === "People") {
    filteredResults = results.filter(
      (result:IUserData, index:number) =>
        results.findIndex((r:IUser) => r.email === result.id) ===
        index
    );
  }

  const TabButton = ({ tab }: { tab: (typeof tabs)[0] }) => (
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

  const PostCard = ({ post }: { post: ISearchData }) => (
    <Card
      className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0"
      onClick={() =>
        navigate(`/post/${post.postTitle}`, { state: { postId: post.id } })
      }
    >
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="size-10 rounded-full border border-border flex items-center justify-center cursor-pointer">
            <AvatarImage
              src={post.creator.avatar}
              alt="avatar-image"
              className="rounded-full"
            />
            <AvatarFallback className="text-sm font-bold text-foreground rounded-full">
              {post.creator.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.creator.name}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div
          className={`${
            post.postBannerImage
              ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]"
              : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
          }`}
        >
          <div
            className={`${
              post.postBannerImage ? "h-full md:w-md xl:w-[500px] mb-2" : "mb-2"
            }`}
          >
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer transition-colors duration-200">
              {post.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2 mb-2">
              {post.postDescription}
            </p>
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

  const UserCard = ({ user }: { user: ISearchData }) => (
    <Card
      className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0"
      onClick={() =>
        navigate(`/user/${user.creator.userName}`, {
          state: { userId: user.creator.id },
        })
      }
    >
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="size-12 rounded-full border border-border flex items-center justify-center cursor-pointer">
              <AvatarImage
                src={user.creator.avatar}
                alt="avatar-image"
                className="rounded-full"
              />
              <AvatarFallback className="text-lg font-bold text-foreground rounded-full">
                {user.creator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">
                {user.creator.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                @{user.creator.userName}
              </p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {user.creator.bio}
              </p>
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
          : "Search for posts, people, or tags to discover amazing content."}
      </p>
    </div>
  );

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl h-full flex flex-col">
        <div className="flex-shrink-0 bg-background border-b border-border/50 pb-4 mb-5">
          <div className="flex items-center space-x-4 mb-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search for posts, people, or tags..."
                  className="w-full pl-4 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-10 w-10 rounded-lg hover:bg-muted/80 transition-colors duration-200"
                >
                  <Search className="size-5 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </form>
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} />
            ))}
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto smooth-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="space-y-6 pb-6">
            {isPending && hasSearched ? (
              <>
                <BlogsSkeleton />
                <BlogsSkeleton />
                <BlogsSkeleton />
              </>
            ) : filteredResults.length === 0 ? (
              <EmptyState />
            ) : (
              filteredResults.map((result:ISearchData) =>
                activeTab === "Posts" ? (
                  <PostCard key={result.id} post={result} />
                ) : (
                  <UserCard key={result.creator.id} user={result} />
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
