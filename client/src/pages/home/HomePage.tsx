import BlogPosts from "@/components/home-page-section/blogPosts";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/useNavigateHandlers";
import { Bookmark, Newspaper, PencilLine, Search } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const { handleSearch, handleBookmarks, handleCreateBlogPost,handleDiscover } = useNavigationHandlers();
  const handlePressDiscover = () => {
    setActiveTab("Discover");
    handleDiscover();
  };
  const handlePressBookmark = () => {
   setActiveTab("Bookmark")
    handleBookmarks();
  };
  const handlePressCreateBlog = () => {
     setActiveTab("CreatePost")
    handleCreateBlogPost();
  };
  const handlePressSearch = () => {
    setActiveTab("Search");
    handleSearch();
  };

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div className="flex justify-center">
        <BlogPosts />
        <div className="bg-background border-t h-14 fixed flex justify-around items-center bottom-0 w-full z-10 sm:hidden">
          <Button variant={"ghost"} onClick={handlePressDiscover}>
            <Newspaper
              className={`size-5 ${
                activeTab === "Discover"
                  ? "text-blue-600 size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
          <Button variant={"ghost"} onClick={handlePressSearch}>
            <Search
              className={`size-5 ${
                activeTab === "Search"
                  ? "text-blue-600 size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
          <Button variant={"ghost"} onClick={handlePressBookmark}>
            <Bookmark
              className={`size-5 ${
                activeTab === "Bookmark"
                  ? "text-blue-600 fill-blue-600  size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
          <Button variant={"ghost"} onClick={handlePressCreateBlog}>
            <PencilLine
              className={`size-5 ${
                activeTab === "CreatePost"
                  ? "text-blue-600 fill-blue-600  size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
