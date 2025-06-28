import Footer from "../footer";
import Header from "../header";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const checkCurrentRoute = useLocation();

  if (checkCurrentRoute.pathname === "/auth") {
    return <Outlet />;
  } else {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  }
};

export default RootLayout;
