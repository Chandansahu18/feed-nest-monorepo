import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import RootLayout from "./components/_layout/RootLayout";
import NotFoundPageWrapper from "./app/not-found/page";
import LandingPageWrapper from "./app/landing/page";
import BookmarksPageWrapper from "./app/bookmarks/page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<RootLayout/>}>
    <Route index={true} element={<LandingPageWrapper/>}/>
    <Route path="/bookmarks" element={<BookmarksPageWrapper/>}/>
    <Route path="/bookmarks/:postId" element={<BookmarksPageWrapper/>}/>
    </Route>
    <Route path="*" element={<NotFoundPageWrapper/>}/>
    </>
  )
);

function App() {
return <RouterProvider router={router}/>
}

export default App;