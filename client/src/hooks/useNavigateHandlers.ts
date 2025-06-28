import { useNavigate } from "react-router-dom";

export const useNavigationHandlers = () => {
  const navigate = useNavigate();

  const handleDiscover = () => {
    navigate("/");
  };

  const handleSearch = () => {
    navigate("/search");
  };

  const handleBookmarks = () => {
    navigate("/bookmarks");
  };

  const handleCreateBlogPost = () => {
    navigate("/create");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return {
    handleDiscover,
    handleSearch,
    handleBookmarks,
    handleCreateBlogPost,
    handleProfile,
    handleSettings,
  };
};