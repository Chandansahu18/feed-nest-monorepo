import { CLOUDINARY_API } from "@/utils/apiClient";
import type { TUserAuthQuotes } from "@/utils/schema/userAuth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Typewriter from "typewriter-effect";

const BackgroundDecoration = () => {
  const { state } = useLocation();
  const [authContent, setAuthContent] = useState<null | TUserAuthQuotes>(null);

  useEffect(() => {
    const fetchAuthSectionQuotes = async () => {
      try {
        const response = await CLOUDINARY_API.get(
          "/v1750697886/auth-section_ngatat.json",
          {
            headers: {
              cache: "no-cache",
            },
          }
        );
        setAuthContent(response.data);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    };
    fetchAuthSectionQuotes();
  }, []);

  if (!authContent) {
    return null;
  }
  return (
    <div className="flex-1 hidden bg-gradient-to-br from-[#93c5fd] to-[#155dfc] md:flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center mb-6 h-36 flex items-center justify-center overflow-hidden">
        <div className="text-white font-extrabold text-lg leading-relaxed">
          <Typewriter
            options={{
              strings: [
                state?.type === "signup"
                  ? authContent.quotes.signup
                  : authContent.quotes.signin,
              ],
              autoStart: true,
              loop: true,
              delay: 30,
              deleteSpeed: 20,
            }}
          />
        </div>
      </div>
      <div className="h-96 w-auto">
        <img
          src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750691631/bg-decoration-auth-section_nyprk9.svg"
          alt="bg-decoration"
          className="size-full object-contain"
        />
      </div>
    </div>
  );
};

export default BackgroundDecoration;
