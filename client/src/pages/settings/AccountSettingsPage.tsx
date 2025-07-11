import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  AlertTriangle,
  Camera,
  User,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Save,
  X,
  UserRoundPen,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUserData } from "@/hooks/useUserData";
import { useUserDataUpdate } from "@/hooks/useUserDataUpdate";
import type { TUserDataUpdate } from "@/utils/schema/userData";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/create-post-sections/ImageUpload";
import { useUserAccountDelete } from "@/hooks/useUserAccountDelete";
import { Textarea } from "@/components/ui/textarea";

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { data: userData, isPending: userDataPending } = useUserData();
  const { mutate: updateUser, isPending: updateUserPending } =
    useUserDataUpdate();
  const { mutate: DeleteAccount } = useUserAccountDelete();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TUserDataUpdate>({
    name: "",
    userName: "",
    email: "",
    bio: "",
    location: "",
    avatar: "",
    profileBanner: "",
    linkedInHandle: "",
    twitterHandle: "",
    githubHandle: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.data?.name || "",
        userName: userData.data?.userName || "",
        email: userData.data?.email || "",
        bio: userData.data?.bio || "",
        location: userData.data?.location || "",
        avatar: userData.data?.avatar || "",
        profileBanner: userData.data?.profileBanner || "",
        linkedInHandle: userData.data?.linkedInHandle || "",
        twitterHandle: userData.data?.twitterHandle || "",
        githubHandle: userData.data?.githubHandle || "",
      });
    }
  }, [userData]);

  const handleInputChange = (field: keyof TUserDataUpdate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleProfileBannerRemove = () => {
    handleInputChange("profileBanner", "");
  };
  const handleAvatarRemove = () => {
    handleInputChange("avatar", "");
  };

  const handleDeleteAccount = () => {
    DeleteAccount(undefined,{
      onSuccess:() =>{
        navigate('/')
      }
    })
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
      newErrors.userName =
        "Username can only contain letters, numbers, and underscores";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    updateUser(formData, {
      onSuccess: () => navigate(`/profile/${formData.userName}`),
    });
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

  if (userDataPending) {
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl font-bold">Profile Edit</h1>
            </div>
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
                <div className="space-y-2">
                  <Label>Profile Banner</Label>
                  <ImageUpload
                    value={formData.profileBanner ?? ""}
                    onChange={(url) => handleInputChange("profileBanner", url)}
                    onRemove={handleProfileBannerRemove}
                    imageType="banner"
                    fileName="profile-banner"
                  />
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-xl text-xs">
                      16:9 Ratio
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1600x900 pixels
                    </p>
                  </div>
                </div>

                {/* Avatar - Made Circular */}
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {formData.avatar ? (
                        // Show avatar with remove button when image exists
                        <div className="relative w-20 h-20">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                            <img
                              src={formData.avatar}
                              alt="Profile picture"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Remove button positioned outside the circular container */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleInputChange("avatar", "")}
                            className="absolute -top-1 -right-1 h-6 w-6 p-0 rounded-full shadow-lg"
                            title="Remove profile picture"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative size-20 rounded-full border-2 border-border">
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center m-1">
                            <ImageUpload
                              value={formData.avatar ?? ""}
                              onChange={(url) =>
                                handleInputChange("avatar", url)
                              }  
                              onRemove={handleAvatarRemove}
                              fileName="profile-avatar"
                              imageType="avatar"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Click to change profile picture
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG. Max size 2MB.
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
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={cn(
                        "rounded-xl",
                        errors.name && "border-destructive"
                      )}
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
                      value={formData.userName}
                      onChange={(e) =>
                        handleInputChange("userName", e.target.value)
                      }
                      className={cn(
                        "rounded-xl",
                        errors.userName && "border-destructive"
                      )}
                      placeholder="Enter your username"
                    />
                    {errors.userName && (
                      <p className="text-sm text-destructive">
                        {errors.userName}
                      </p>
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
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={cn(
                        "pl-10 rounded-xl",
                        errors.email && "border-destructive"
                      )}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <div className="relative">
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className={cn(
                        "rounded-xl resize-none w-full pl-10",
                        errors.bio && "border-destructive"
                      )}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      maxLength={250}
                    />
                    <UserRoundPen className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  </div>
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
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className={cn(
                        "pl-10 rounded-xl",
                        errors.location && "border-destructive"
                      )}
                      placeholder="Where are you based?"
                      maxLength={50}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">
                      {errors.location}
                    </p>
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
                  {
                    field: "linkedInHandle",
                    icon: Linkedin,
                    placeholder: "https://www.linkedin.com/in/username",
                    label: "LinkedIn Profile",
                  },
                  {
                    field: "twitterHandle",
                    icon: Twitter,
                    placeholder: "https://x.com/username",
                    label: "X (Twitter) Profile",
                  },
                  {
                    field: "githubHandle",
                    icon: Github,
                    placeholder: "https://github.com/username",
                    label: "GitHub Profile",
                  },
                ].map(({ field, icon: Icon, placeholder, label }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{label}</Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id={field}
                        value={formData[field as keyof TUserDataUpdate] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            field as keyof TUserDataUpdate,
                            e.target.value
                          )
                        }
                        className={cn(
                          "pl-10 rounded-xl",
                          errors[field] && "border-destructive"
                        )}
                        placeholder={placeholder}
                      />
                    </div>
                    {errors[field] && (
                      <p className="text-sm text-destructive">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div>
              <Button
                onClick={handleSave}
                disabled={updateUserPending}
                className="w-full rounded-xl py-3"
                size="lg"
              >
                {updateUserPending ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {updateUserPending ? "Saving Changes..." : "Save Changes"}
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
                  <h3 className="font-semibold text-destructive mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your personal data will be deleted permanently when you
                    delete your account on feednest. This action is
                    irreversible.
                  </p>
                </div>

                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full rounded-xl">
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
                        This action cannot be undone. This will permanently
                        delete your account and remove all associated data.
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
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto"
                      >
                        Delete Account
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
