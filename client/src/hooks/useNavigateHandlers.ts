import { useNavigate } from "react-router-dom";
export const useNavigationHandlers = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/auth", { state: { type: "signin" } });
  };
  const handleFeed = () => {
    navigate("/home", { state: { athenticated: false } });
  };

  const handleCreateBlogPost = () => {
    navigate("/create", { state: { authenticated: true } });
  };

  const handleSearch = () => {
    navigate("/search");
  };

  const handleBookmarks = () => {
 navigate("/bookmarks")
  };
  const handleDiscover = () =>{
    navigate("/home")
  }

  const handleUserProfile = (userName:string) =>{
    navigate(`/user/${userName}`)
  }

  const handleAccountSettings = () =>{
    navigate("/settings")
  }

  return {
    handleSignIn,
    handleFeed,
    handleCreateBlogPost,
    handleSearch,
    handleBookmarks,
    handleDiscover,
    handleUserProfile,
    handleAccountSettings
  };
};
