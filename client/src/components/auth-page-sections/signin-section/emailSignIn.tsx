import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import PendingLoader from "../../pendingLoader";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import type { TSetEmailAuthProp } from "@/utils/schema/userAuth";

const EmailSignIn = ({ setIsEmailAuth }:TSetEmailAuthProp) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    data: emailAuthData,
    mutate: emailAuthMutate,
    isPending: isEmailAuthPending,
  } = useEmailAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (emailAuthData === 204) {
      navigate("/home");
    }
  }, [emailAuthData]);

  const handleSignUp = () => {
    navigate("/auth", { state: { type: "signup" } });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailAuthMutate(formData);
  };
  if (isEmailAuthPending) {
    return <PendingLoader />;
  }

  return (
    <motion.div
      key="signin-form"
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="backdrop-blur-sm p-6 rounded-lg bg-background/80 border">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEmailAuth(false)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground">
              Enter your details to sign in
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign in
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Button
              variant="link"
              className="hover:text-primary/80 font-medium p-0 h-auto text-blue-600"
              onClick={handleSignUp}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailSignIn;
