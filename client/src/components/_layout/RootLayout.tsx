import Footer from "../footer";
import Header from "../header";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const checkCurrentRoute = useLocation();
     
  if (checkCurrentRoute.pathname === "/auth") {
    return <Outlet />;
  } else if (checkCurrentRoute.pathname === "/") {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  }
};

export default RootLayout;
