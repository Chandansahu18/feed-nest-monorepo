import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useUserData } from "@/hooks/useUserData";
import { PenLine, Search } from "lucide-react";

const Header = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useUserData();

  const isLandingPage = pathname === "/";

  const handleSignIn = () => {
    navigate("/auth", { state: { type: "signin" } });
  };
  const handleFeed = () => {
    navigate("/home", { state: { athenticated: false } });
  };
  const handleCreateBlogPost = () => {
    navigate("/create", { state: { authenticated: true } });
  };

  const handleSettingsModal = () => {};
  const handleSearch = () => {};
  return (
    <>
      <div className="h-16 px-4 border-b">
        <div className="h-full flex justify-between items-center">
          <div className="h-full w-40 flex justify-start items-center cursor-pointer">
            {theme === "dark" ? (
              <>
                <img
                  src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750357672/favicon_migqwq.svg"
                  alt="icon-dark"
                  className="size-5 object-contain min-[375px]:hidden"
                />
                <img
                  src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750397416/logo-dark_jweijj.svg"
                  alt="logo-dark"
                  className="h-full w-32 object-cover hidden min-[375px]:block"
                />
              </>
            ) : (
              <>
                <img
                  src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750522650/favicon_nbl5mf.svg"
                  alt="icon"
                  className="size-5 object-contain min-[375px]:hidden"
                />
                <img
                  src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750397284/logo_sk9cds.svg"
                  alt="logo"
                  className="h-full w-32 object-cover hidden min-[375px]:block"
                />
              </>
            )}
          </div>

          <div className="h-full lg:w-2/4 sm:w-80 flex justify-end items-center">
            {!isLandingPage ? (
              <div className="hidden sm:flex sm:w-12 lg:w-56 h-full items-center justify-center">
                <div
                  className="h-10 w-52 flex items-center justify-center rounded-full lg:outline-1 outline-gray-300 hover:outline-2 hover:outline-gray-200 dark:outline-gray-700"
                  onClick={handleSearch}
                >
                  <div className="hidden lg:flex justify-end items-center h-10 w-40 cursor-pointer">
                    <h1 className="text-base font-medium text-gray-500">
                      Search
                    </h1>
                  </div>
                  <div
                    className="size-10 flex justify-center items-center"
                    onClick={handleSearch}
                  >
                    <Search className="size-5 cursor-pointer" color="gray" />
                  </div>
                </div>
              </div>
            ) : null}

            {data ? (
              <div className="h-full w-16 hidden items-center sm:flex justify-center">
                <Button
                  onClick={handleCreateBlogPost}
                  className="cursor-pointer h-10 w-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <PenLine className="size-5" color="white" />
                </Button>
              </div>
            ) : !isLandingPage ? null : (
              <div className="h-full w-20 hidden items-center lg:flex justify-center">
                <Button
                  variant={"ghost"}
                  onClick={handleFeed}
                  className="cursor-pointer h-10"
                >
                  Feeds
                </Button>
              </div>
            )}

            <div className="h-full w-10 flex justify-center items-center">
              <ModeToggle />
            </div>
            {data ? (
              <div className="h-full w-10 flex justify-center items-center">
                <Button
                  variant={"outline"}
                  className="h-10 w-10 rounded-full cursor-pointer"
                  onClick={handleSettingsModal}
                >
                  CS
                </Button>
              </div>
            ) : (
              <div className="h-full w-20 flex justify-center items-center">
                <Button
                  variant={"outline"}
                  className="h-10 w-20 rounded-xl cursor-pointer"
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
