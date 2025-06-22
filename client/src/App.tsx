import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import RootLayout from "./components/_layout/RootLayout";
import NotFoundPageWrapper from "./app/not-found/page";
import LandingPageWrapper from "./app/landing/page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<RootLayout/>}>
    <Route index={true} element={<LandingPageWrapper/>}/>
    </Route>
    <Route path="*" element={<NotFoundPageWrapper/>}/>
    </>
  )
);

function App() {
return <RouterProvider router={router}/>
}

export default App;
