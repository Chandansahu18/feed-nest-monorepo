import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./themeProvider";
import { Button } from "./ui/button";
import { ModeToggle } from "./modeToggle";
import { Bookmark, LogOut, PenLine, Search, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { useState } from "react";
import PendingLoader from "./pendingLoader";
import { useUserData } from "@/hooks/user/useUserData";
import { useUserLogout } from "@/hooks/user/useUserLogout";

const Header = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useUserData();
  const { mutate: userLogout, isPending: logoutPending } = useUserLogout();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const isLandingPage = pathname === "/";
  const isSearchPage = pathname === "/search";
  const isUserLoggedIn = data?.data;
  const handleSignOut = () => {
    userLogout();
    setIsLogoutDialogOpen(false);
  };

  const handleHomePage = () => {
    isUserLoggedIn ? navigate("/home") : navigate("/");
  };

  if (logoutPending) {
    return <PendingLoader />;
  }
  return (
    <>
      <div className="h-16 px-4 border-b fixed w-full top-0 bg-background z-10">
        <div className="h-full flex justify-between items-center">
          <div
            className="h-full w-40 flex justify-start items-center cursor-pointer"
            onClick={handleHomePage}
          >
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
                {isSearchPage ? null : (
                  <div
                    className="h-10 w-52 flex items-center justify-center rounded-xl lg:outline-1 outline-gray-300 hover:outline-2 hover:outline-gray-200 dark:outline-gray-700"
                    onClick={() => navigate("/search")}
                  >
                    <div className="hidden lg:flex justify-end items-center h-10 w-40 cursor-pointer">
                      <h1 className="text-sm font-medium text-gray-500">
                        Search
                      </h1>
                    </div>
                    <div
                      className="size-10 flex justify-center items-center"
                      onClick={() => navigate("/search")}
                    >
                      <Search className="size-5 cursor-pointer" color="gray" />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {isUserLoggedIn ? (
              <div className="h-full w-16 hidden items-center sm:flex justify-center">
                <Button
                  onClick={() =>
                    navigate("/create", { state: { authenticated: true } })
                  }
                  className="cursor-pointer h-10 w-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center"
                >
                  <PenLine className="size-5" color="white" />
                </Button>
              </div>
            ) : (
              isLandingPage && (
                <div className="h-full w-20 hidden items-center lg:flex justify-center">
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      navigate("/home", { state: { athenticated: false } })
                    }
                    className="cursor-pointer h-10"
                  >
                    Feeds
                  </Button>
                </div>
              )
            )}

            <div className="h-full w-10 flex justify-center items-center">
              <ModeToggle />
            </div>
            {isUserLoggedIn ? (
              <Menubar className="border-none bg-background">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer p-0 h-10 w-10 rounded-full border data-[state=open]:bg-transparent hover:bg-transparent focus:bg-transparent">
                    <Avatar className="size-10 rounded-full border flex items-center justify-center">
                      <AvatarImage />
                      <AvatarFallback className="text-sm font-bold">
                        CS
                      </AvatarFallback>
                    </Avatar>
                  </MenubarTrigger>
                  <MenubarContent className="w-60 rounded-2xl mx-5 p-2">
                    <div
                      className="flex gap-1 px-2 py-3 rounded-xl hover:bg-accent"
                      onClick={() =>
                        navigate(`/profile/${isUserLoggedIn.userName}`)
                      }
                    >
                      <div className="size-12 mr-2 rounded-full">
                        <Avatar className="size-full rounded-full border flex items-center justify-center cursor-pointer">
                          <AvatarImage
                            src={data.data?.avatar}
                            alt="avatar"
                            className="rounded-full"
                          />
                          <AvatarFallback className="text-sm font-bold rounded-full">
                            {data.data?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-1 flex-col cursor-pointer">
                        <h3 className="font-semibold">{data.data?.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground">
                         @{data.data?.userName}
                        </p>
                      </div>
                    </div>
                    <MenubarSeparator className="my-1" />
                    <div className="flex flex-col gap-1 py-1">
                      <MenubarItem
                        className="cursor-pointer px-3 py-2"
                        onClick={() => navigate("/bookmarks")}
                      >
                        <Bookmark className="size-4" />
                        <h1 className="text-sm">Bookmarks</h1>
                      </MenubarItem>
                      <MenubarItem
                        className="cursor-pointer px-3 py-2"
                        onClick={() => navigate("/settings")}
                      >
                        <User className="size-4" />
                        <h1 className="text-sm">Account settings</h1>
                      </MenubarItem>
                    </div>
                    <MenubarSeparator className="my-1" />
                    <MenubarItem
                      className="cursor-pointer px-3 py-2"
                      onClick={() => setIsLogoutDialogOpen(true)}
                    >
                      <LogOut className="text-red-500 size-5" />
                      <h1 className="text-sm text-red-500 font-medium">
                        Log out
                      </h1>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            ) : (
              <div className="h-full w-20 flex justify-center items-center">
                <Button
                  variant={"outline"}
                  className="h-10 w-20 rounded-xl cursor-pointer"
                  onClick={() =>
                    navigate("/auth", { state: { type: "signin" } })
                  }
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </div>
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300" />
          <DialogContent className="fixed left-[50%] top-[50%] right-[50%] bottom-[30%] z-50 max-[425px]:w-72  max-w-sm translate-x-[-50%] translate-y-[-50%] gap-8 bg-background/95 backdrop-blur-md p-6 transition-all duration-300 ease-out rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-xl font-semibold text-center leading-tight">
                Are you sure you want to sign out?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-center gap-3 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="flex-1 rounded-xl h-11 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignOut}
                className="flex-1 rounded-xl h-11 font-medium bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, sign out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Header;
