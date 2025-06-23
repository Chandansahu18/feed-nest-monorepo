import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import RootLayout from "./components/_layout/RootLayout";
import NotFoundPageWrapper from "./app/not-found/page";
import LandingPageWrapper from "./app/landing/page";
import AuthPageWrapper from "./app/auth/page";
import HomePageWrapper from "./app/home/page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<RootLayout/>}>
    <Route index={true} element={<LandingPageWrapper/>}/>
    <Route path="/auth" element={<AuthPageWrapper/>}/>
    <Route path="/home" element={<HomePageWrapper/>}/>
    </Route>
    <Route path="*" element={<NotFoundPageWrapper/>}/>
    </>
  )
);

function App() {
return <RouterProvider router={router}/>
}

export default App;
