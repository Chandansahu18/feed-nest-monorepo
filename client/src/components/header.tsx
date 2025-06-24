import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/auth", { state: { type: "signin" } });
  };
  const handleFeed = () => {
    navigate("/home", { state: { athenticated: false } });
  };

  return (
    <div className="h-16 px-4 border-b">
      <div className="h-full flex justify-between items-center">
        <div className="h-10 w-40 flex justify-start items-center cursor-pointer">
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

        <div className="h-10 lg:w-72 flex justify-end">
          <div className="h-full w-20 hidden lg:items-center lg:flex lg:justify-center">
            <Button
              variant={"ghost"}
              onClick={handleFeed}
              className="cursor-pointer"
            >
              Feeds
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
