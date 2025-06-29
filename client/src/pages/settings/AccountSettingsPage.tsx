import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Camera,
  User,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Save,
  Upload,
  X,
} from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  profileBanner?: string;
  linkedInHandle?: string;
  twitterHandle?: string;
  githubHandle?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({} as UserProfile);
  const [passwordData, setPasswordData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProfile: UserProfile = {
        id: "1",
        name: "John Doe",
        userName: "johndoe",
        email: "john.doe@example.com",
        bio: "Full-stack developer passionate about creating amazing user experiences. Love to write about tech, design, and productivity.",
        location: "San Francisco, CA",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        profileBanner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=200&fit=crop",
        linkedInHandle: "https://www.linkedin.com/in/johndoe",
        twitterHandle: "https://x.com/johndoe",
        githubHandle: "https://github.com/johndoe",
      };

      setUserProfile(mockProfile);
      setFormData(mockProfile);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.userName?.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
      newErrors.userName = "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.bio && formData.bio.length > 250) {
      newErrors.bio = "Bio must be less than 250 characters";
    }

    if (formData.location && formData.location.length > 50) {
      newErrors.location = "Location must be less than 50 characters";
    }

    // Validate social media URLs
    const socialValidations = [
      { field: 'linkedInHandle', prefix: 'https://www.linkedin.com/in/', name: 'LinkedIn' },
      { field: 'twitterHandle', prefix: 'https://x.com/', name: 'X (Twitter)' },
      { field: 'githubHandle', prefix: 'https://github.com/', name: 'GitHub' },
    ];

    socialValidations.forEach(({ field, prefix, name }) => {
      const value = formData[field as keyof UserProfile];
      if (value && !value.startsWith(prefix)) {
        newErrors[field] = `Please enter a valid ${name} profile URL`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUserProfile(formData);
      navigate("/settings/profile");
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setDeleteDialogOpen(false);
  };

  const handleImageUpload = (type: "avatar" | "banner") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const mockUrl = URL.createObjectURL(file);
        handleInputChange(type === "avatar" ? "avatar" : "profileBanner", mockUrl);
      }
    };
    input.click();
  };

  const ProfileSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="flex items-center space-x-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings/profile")}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Account Settings</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="hidden md:flex rounded-xl px-6"
            >
              {saving ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Profile Images */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Camera className="w-5 h-5" />
                  <span>Profile Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner */}
                <div className="space-y-2">
                  <Label>Profile Banner</Label>
                  <div className="relative">
                    <div
                      className="h-24 md:h-32 bg-muted rounded-xl overflow-hidden relative group cursor-pointer"
                      onClick={() => handleImageUpload("banner")}
                    >
                      {formData.profileBanner ? (
                        <img
                          src={formData.profileBanner}
                          alt="Profile banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="w-6 md:w-8 h-6 md:h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-5 md:w-6 h-5 md:h-6 text-white" />
                      </div>
                    </div>
                    {formData.profileBanner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange("profileBanner", "");
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white size-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => handleImageUpload("avatar")}
                    >
                      <Avatar className="size-16 md:size-20 border-4 border-background">
                        <AvatarImage
                          src={formData.avatar ?? undefined}
                          alt="Profile picture"
                        />
                        <AvatarFallback className="text-sm md:text-lg font-bold">
                          {formData.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                        <Camera className="w-4 md:w-5 h-4 md:h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Click to change profile picture</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <User className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={cn("rounded-xl", errors.name && "border-destructive")}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName">Username *</Label>
                    <Input
                      id="userName"
                      value={formData.userName || ""}
                      onChange={(e) => handleInputChange("userName", e.target.value)}
                      className={cn("rounded-xl", errors.userName && "border-destructive")}
                      placeholder="Enter your username"
                    />
                    {errors.userName && (
                      <p className="text-sm text-destructive">{errors.userName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={cn("pl-10 rounded-xl", errors.email && "border-destructive")}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className={cn("rounded-xl resize-none", errors.bio && "border-destructive")}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={250}
                  />
                  <div className="flex justify-between items-center">
                    {errors.bio && (
                      <p className="text-sm text-destructive">{errors.bio}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {formData.bio?.length || 0}/250
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className={cn("pl-10 rounded-xl", errors.location && "border-destructive")}
                      placeholder="Where are you based?"
                      maxLength={50}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Github className="w-5 h-5" />
                  <span>Social Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { field: 'linkedInHandle', icon: Linkedin, placeholder: 'https://www.linkedin.com/in/username', label: 'LinkedIn Profile' },
                  { field: 'twitterHandle', icon: Twitter, placeholder: 'https://x.com/username', label: 'X (Twitter) Profile' },
                  { field: 'githubHandle', icon: Github, placeholder: 'https://github.com/username', label: 'GitHub Profile' },
                ].map(({ field, icon: Icon, placeholder, label }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{label}</Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id={field}
                        value={formData[field as keyof UserProfile] || ""}
                        onChange={(e) => handleInputChange(field as keyof UserProfile, e.target.value)}
                        className={cn("pl-10 rounded-xl", errors[field] && "border-destructive")}
                        placeholder={placeholder}
                      />
                    </div>
                    {errors[field] && (
                      <p className="text-sm text-destructive">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Eye className="w-5 h-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {[
                    { field: 'currentPassword', label: 'Current Password', key: 'current' },
                    { field: 'newPassword', label: 'New Password', key: 'new' },
                    { field: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
                  ].map(({ field, label, key }) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{label}</Label>
                      <div className="relative">
                        <Input
                          id={field}
                          type={showPasswords[key as keyof typeof showPasswords] ? "text" : "password"}
                          value={passwordData[field as keyof PasswordForm]}
                          onChange={(e) => handlePasswordChange(field as keyof PasswordForm, e.target.value)}
                          className="pr-10 rounded-xl"
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePasswordVisibility(key as keyof typeof showPasswords)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        >
                          {showPasswords[key as keyof typeof showPasswords] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    ) : null}
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Save Button (Mobile) */}
            <div className="md:hidden">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl py-3"
                size="lg"
              >
                {saving ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <Separator className="my-8" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-2xl border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your personal data will be deleted permanently when you delete your account on feednest. This action is irreversible.
                  </p>
                </div>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-destructive/10 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <DialogTitle className="text-destructive">
                          Confirm Account Deletion
                        </DialogTitle>
                      </div>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                      <p className="text-sm font-medium text-destructive mb-2">
                        What will be deleted:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your profile and account information</li>
                        <li>• All your blog posts and content</li>
                        <li>• Your bookmarks and saved posts</li>
                        <li>• All comments and interactions</li>
                      </ul>
                    </div>
                    
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;