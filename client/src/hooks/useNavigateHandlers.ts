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
    navigate("/search")
  };

  return {
    handleSignIn,
    handleFeed,
    handleCreateBlogPost,
    handleSearch
  };
};