import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trash2, AlertTriangle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const AccountSettingsPage = () => {
  const [showCurrentPassword, setShowCurrentPasswordState] = useState(false);
  const [showNewPassword, setShowNewPasswordState] = useState(false);
  const [showConfirmPassword, setShowConfirmPasswordState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Reset form
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="pb-16 mt-20 sm:p-8 w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6">
        <div className="lg:w-2xl">
          <motion.div
            key="change-password-form"
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="backdrop-blur-sm p-6 bg-background/80">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Change Password
                  </h1>
                  <p className="text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="current-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="h-12 pr-10"
                        placeholder="Enter your current password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPasswordState(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="new-password"
                      className="text-sm font-medium text-foreground"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="h-12 pr-10"
                        placeholder="Enter your new password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowNewPasswordState(!showNewPassword)
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="h-12 pr-10"
                        placeholder="Confirm your new password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPasswordState(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating Password...</span>
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
          <div>
            <Separator />
          </div>
          <motion.div
            key="danger-zone"
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="backdrop-blur-sm p-6 bg-background/80 border-red-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-red-700">
                    Danger Zone
                  </h1>
                  <p className="text-muted-foreground">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-red-50/80 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Your personal data will be deleted permanently when you
                    delete your account on feednest. This action is
                    irreversible.
                  </p>

                  <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full py-6 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md backdrop-blur-sm bg-background/90 border border-red-200">
                      <DialogHeader>
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <DialogTitle className="text-red-700">
                            Confirm Account Deletion
                          </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground">
                          This action cannot be undone. This will permanently
                          delete your account and remove all associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-red-50/80 p-4 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-800">
                          What will be deleted:
                        </p>
                        <ul className="text-sm text-red-700 mt-2 space-y-1">
                          <li>• Your profile and account information</li>
                          <li>• All your blog posts and content</li>
                        </ul>
                      </div>
                      <DialogFooter className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                          disabled={isLoading}
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="py-6 rounded-xl bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Deleting...</span>
                            </div>
                          ) : (
                            "Delete Account"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AccountSettingsPage;
