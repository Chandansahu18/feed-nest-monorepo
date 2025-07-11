import { useUserData } from "@/hooks/user/useUserData";
import { Button } from "./ui/button";
import { Bookmark, Newspaper, PencilLine, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const { data } = useUserData();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLandingPage = pathname === "/"
  const isUserLoggedIn = data?.data;
  const [activeTab, setActiveTab] = useState("Discover");

  useEffect(() => {
    if (pathname === "/bookmarks" || pathname.startsWith("/bookmarks/")) {
      setActiveTab("Bookmark");
    } else if (pathname === "/search") {
      setActiveTab("Search");
    } else if (pathname === "/create" || pathname === "/write") {
      setActiveTab("CreatePost");
    } else {
      setActiveTab("Discover");
    }
  }, [pathname]);

  const handlePressDiscover = () => {
    setActiveTab("Discover");
    navigate("/home");
  };
  const handlePressBookmark = () => {
    setActiveTab("Bookmark");
    navigate("/bookmarks");
  };
  const handlePressCreateBlog = () => {
    setActiveTab("CreatePost");
    navigate("/create", { state: { authenticated: true } });
  };
  const handlePressSearch = () => {
    setActiveTab("Search");
    navigate("/search");
  };

  return (
    <>
      {isUserLoggedIn || !isLandingPage ? (
        <footer className="bg-background border-t h-14 fixed flex justify-around items-center bottom-0 w-full z-10 sm:hidden">
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
        </footer>
      ) : (
        <footer className="bg-background border-t py-6">
          <div className="flex flex-col px-4 md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© FeedNest 2025</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <p className="hover:text-foreground">Made with ❤️</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
