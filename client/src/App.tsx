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
import BookmarkedPostPageWrapper from "./app/posts/bookmarked-posts/post/page";
import BookmarkedPostsPageWrapper from "./app/posts/bookmarked-posts/bookmarked-posts/posts/page";
import CreatePostPageWrapper from "./app/posts/create-post/page";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
          <Route index={true} element={<PublicRouteAccess><LandingPageWrapper /></PublicRouteAccess>} />
          <Route path="/auth" element={<PublicRouteAccess><AuthPageWrapper /></PublicRouteAccess>} />
          <Route path="/home" element={<PublicRouteAccess><HomePageWrapper /></PublicRouteAccess>} />
          <Route path="/create" element={<ProtectedRouteAccess><CreatePostPageWrapper /></ProtectedRouteAccess>} />
          <Route path="/settings" element={<ProtectedRouteAccess><AccountSettingsPageWrapper /></ProtectedRouteAccess>} />
          <Route path="/bookmarks" element={<ProtectedRouteAccess><BookmarkedPostsPageWrapper /></ProtectedRouteAccess>} />
          <Route path="/bookmarks/:postId" element={<ProtectedRouteAccess><BookmarkedPostPageWrapper /></ProtectedRouteAccess>} />
      </Route>
      <Route path="*" element={<NotFoundPageWrapper />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;