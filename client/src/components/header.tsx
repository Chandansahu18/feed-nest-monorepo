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
import { Menu } from "lucide-react";
const Header = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/auth");
  };
  const handleFeed = () => {
    navigate("/feeds");
  };
  const handleAbout = () => {
    navigate("/about");
  };

  return (
    <div className="h-16 px-4 border-b">
      {/* main header content */}
      <div className="h-full flex justify-between items-center">
        {/* left content */}
        <div className="h-10 w-44 flex justify-start items-center">
          {/* Dropdown button*/}
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
            {/* Dropdown content */}
            <DropdownMenuContent className="ml-3 rounded-xl">
              <DropdownMenuItem onClick={handleFeed}>Feeds</DropdownMenuItem>
              <DropdownMenuItem onClick={handleAbout}>About</DropdownMenuItem>
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
                src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750359425/favicon_spilef.svg"
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
        {/* right content */}
        <div className="h-10 lg:w-72 flex">
          <div className="h-full w-40 hidden lg:flex lg:justify-center">
           <Button variant={"ghost"} onClick={handleFeed}>
             Feeds
           </Button>
           <Button variant={"ghost"} onClick={handleAbout}>
             About
           </Button>
          </div>
          {/* theme */}
          <div className="h-full w-10">
            <ModeToggle />
          </div>
          {/* sign in */}
          <Button
            variant={"outline"}
            className="h-full w-20 rounded-xl"
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