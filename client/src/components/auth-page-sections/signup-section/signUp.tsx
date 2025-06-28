import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/firebase/config";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import type { TGoogleAuth } from "@/utils/schema/userAuth";
import BackgroundDecoration from "../backgroundDecoration";
import EmailSignUp from "./emailSignUp";
import { useTheme } from "@/components/themeProvider";
import PendingLoader from "../../pendingLoader";

const SignUp = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isEmailAuth, setIsEmailAuth] = useState(false);
  const {
    mutate: googleAuthMutate,
    data: googleAuthData,
    error,
    isPending: isGoogleAuthPending,
  } = useGoogleAuth();

  useEffect(() => {
    if (googleAuthData === 204) {
      navigate("/home");
    }
  }, [googleAuthData]);

  const handleSignIn = () => {
    navigate("/auth", { state: { type: "signin" } });
  };

  const handleGoogleAuth = async () => {
    const responseFromGoogle = await signInWithPopup(auth, googleAuthProvider);
    const userData: TGoogleAuth = {
      name: responseFromGoogle.user.displayName ?? "",
      email: responseFromGoogle.user.email ?? "",
    };
    googleAuthMutate(userData);
  };

  if (isGoogleAuthPending) {
    return <PendingLoader />;
  }

  if (error?.message.includes('429')) {
    return <div>{error.message}</div>
  }
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="flex-1 bg-background flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <motion.div>
            {!isEmailAuth ? (
              <motion.div
                key="social-signup"
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-background">
                  <div className="text-center space-y-4 mb-6">
                    <div className="flex justify-center">
                      <div className="size-10 flex items-center justify-center">
                        {theme === "dark" ? (
                          <img
                            src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750357672/favicon_migqwq.svg"
                            alt="icon-dark"
                            className="size-full"
                          />
                        ) : (
                          <img
                            src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750522650/favicon_nbl5mf.svg"
                            alt="icon"
                            className="size-full"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        feednest
                      </h1>
                      <p className="text-muted-foreground text-sm font-medium dark:text-white mt-2">
                        sign up
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-sm font-medium cursor-pointer rounded-xl"
                      onClick={handleGoogleAuth}
                    >
                      <img src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750786711/google-logo_uoj06a.svg" alt="google-logo" className="size-4 mr-2"/>
                      Continue with Google
                    </Button>

                    <div className="flex items-center space-x-4 my-6">
                      <Separator className="flex-1" />
                      <span className="text-sm text-muted-foreground dark:text-white">
                        or
                      </span>
                      <Separator className="flex-1" />
                    </div>

                    <Button
                      variant="link"
                      className="w-full text-blue-600 hover:text-blue-700 dark:text-white font-medium cursor-pointer text-sm"
                      onClick={() => setIsEmailAuth(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Continue with email address →
                    </Button>

                    <div className="text-center mt-4">
                      <span className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                      </span>
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 dark:text-white font-medium p-0 h-auto cursor-pointer text-sm"
                        onClick={handleSignIn}
                      >
                        Sign in
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <EmailSignUp setIsEmailAuth={setIsEmailAuth} />
            )}
          </motion.div>
        </motion.div>
      </div>
      <BackgroundDecoration />
    </div>
  );
};

export default SignUp;
