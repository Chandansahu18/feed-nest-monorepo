import Footer from "../footer";
import Header from "../header";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
