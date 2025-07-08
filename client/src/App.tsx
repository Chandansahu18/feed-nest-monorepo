import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import RootLayout from "./components/_layout/RootLayout";
import NotFoundPageWrapper from "./app/not-found/page";
import LandingPageWrapper from "./app/landing/page";
import AuthPageWrapper from "./app/auth/page";
import HomePageWrapper from "./app/home/page";
import { ProtectedRouteAccess, PublicRouteAccess } from "./middleware/auth";
import AccountSettingsPageWrapper from "./app/settings/page";
import BookmarkedPostPageWrapper from "./app/bookmarked/post/page";
import BookmarkedPostsPageWrapper from "./app/bookmarked/posts/page";
import CreatePostPageWrapper from "./app/posts/create-post/page";
import SearchPageWrapper from "./app/search/page";
import UserProfilePageWrapper from "./app/user/page";
import PostPageWrapper from "./app/posts/post/page";
import SearchedUserPageWrapper from "./app/search/user/page";
import EditPostPageWrapper from "./app/posts/edit-post/page";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
          <Route index element={<PublicRouteAccess><LandingPageWrapper /></PublicRouteAccess>} />
          <Route path="auth" element={<PublicRouteAccess><AuthPageWrapper /></PublicRouteAccess>} />
          <Route path="home" element={<PublicRouteAccess><HomePageWrapper /></PublicRouteAccess>} />
          <Route path="search" element={<SearchPageWrapper />} />
          <Route path="post/:postTitle" element={<PostPageWrapper />} />
          <Route path="user/:username" element={<SearchedUserPageWrapper />} />
          <Route path="profile/:username" element={<ProtectedRouteAccess><UserProfilePageWrapper /></ProtectedRouteAccess>} />
          <Route path="post/edit" element={<ProtectedRouteAccess><EditPostPageWrapper /></ProtectedRouteAccess>} />
          <Route path="create" element={<ProtectedRouteAccess><CreatePostPageWrapper /></ProtectedRouteAccess>} />
          <Route path="settings" element={<ProtectedRouteAccess><AccountSettingsPageWrapper /></ProtectedRouteAccess>} />
          <Route path="bookmarks" element={<ProtectedRouteAccess><BookmarkedPostsPageWrapper /></ProtectedRouteAccess>} />
          <Route path="bookmarks/:postTitle" element={<ProtectedRouteAccess><BookmarkedPostPageWrapper /></ProtectedRouteAccess>} />
      </Route>
      <Route path="*" element={<NotFoundPageWrapper />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;