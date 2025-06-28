import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Menu, Bookmark } from "lucide-react";
const Header = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/auth");
  };
  const handleFeed = () => {
    navigate("/feeds");
  };
  const handleContact = () => {
    navigate("/contact");
  };
  const handleBookmarks = () => {
    navigate("/bookmarks");
  };

  return (
    <div className="h-16 px-4 border-b">
      <div className="h-full flex justify-between items-center">
        <div className="h-10 w-44 flex justify-start items-center cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="min-[1024px]:hidden flex items-center justify-start"
              >
                <Menu className="size-7" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="ml-3 rounded-xl">
              <DropdownMenuItem onClick={handleFeed} className="cursor-pointer">
                Feeds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBookmarks} className="cursor-pointer">
                Bookmarks
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleContact}
                className="cursor-pointer"
              >
                Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        <div className="h-10 lg:w-72 flex">
          <div className="h-full w-40 hidden lg:flex lg:justify-center">
            <Button
              variant={"ghost"}
              onClick={handleFeed}
              className="cursor-pointer"
            >
              Feeds
            </Button>
            <Button
              variant={"ghost"}
              onClick={handleBookmarks}
              className="cursor-pointer gap-2"
            >
              <Bookmark className="w-4 h-4" />
              Bookmarks
            </Button>
            <Button
              variant={"ghost"}
              onClick={handleContact}
              className="cursor-pointer"
            >
              Contact
            </Button>
          </div>

          <div className="h-full w-10">
            <ModeToggle />
          </div>

          <Button
            variant={"outline"}
            className="h-full w-20 rounded-xl cursor-pointer"
            onClick={handleSignIn}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;