import BlogPosts from "@/components/home-page-section/blogPosts";
import { Button } from "@/components/ui/button";
import { Bookmark, Newspaper, PencilLine, Search } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Discover");

  return (
    <div className="pb-16 pt-5 sm:p-8 min-h-screen w-full px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl lg:px-8 ">
      <div className="flex justify-center">
        <BlogPosts />
        <div className="bg-background border-t h-14 fixed flex justify-around items-center bottom-0 w-full z-10 sm:hidden">
          <Button variant={"ghost"} onClick={() => setActiveTab("Discover")}>
            <Newspaper
              className={`size-5 ${
                activeTab === "Discover"
                  ? "text-blue-600 size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
          <Button variant={"ghost"} onClick={() => setActiveTab("Search")}>
            <Search
              className={`size-5 ${
                activeTab === "Search"
                  ? "text-blue-600 size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
          <Button variant={"ghost"} onClick={() => setActiveTab("Bookmark")}>
            <Bookmark
              className={`size-5 ${
                activeTab === "Bookmark"
                  ? "text-blue-600 fill-blue-600  size-6"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </Button>
          <Button variant={"ghost"} onClick={() => setActiveTab("CreatePost")}>
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
