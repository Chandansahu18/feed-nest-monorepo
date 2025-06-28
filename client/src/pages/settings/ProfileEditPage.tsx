import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft,
  Camera,
  Save,
  User,
  Mail,
  MapPin,
  Link,
  Github,
  Linkedin,
  Twitter,
  Upload,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock user data type
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

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        githubHandle: "https://github.com/johndoe"
      };
      
      setUserProfile(mockProfile);
      setFormData(mockProfile);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.userName?.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
      newErrors.userName = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.bio && formData.bio.length > 250) {
      newErrors.bio = 'Bio must be less than 250 characters';
    }

    if (formData.location && formData.location.length > 50) {
      newErrors.location = 'Location must be less than 50 characters';
    }

    // Validate social media URLs
    if (formData.linkedInHandle && !formData.linkedInHandle.startsWith('https://www.linkedin.com/in/')) {
      newErrors.linkedInHandle = 'Please enter a valid LinkedIn profile URL';
    }

    if (formData.twitterHandle && !formData.twitterHandle.startsWith('https://x.com/')) {
      newErrors.twitterHandle = 'Please enter a valid X (Twitter) profile URL';
    }

    if (formData.githubHandle && !formData.githubHandle.startsWith('https://github.com/')) {
      newErrors.githubHandle = 'Please enter a valid GitHub profile URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile
      setUserProfile(formData as UserProfile);
      
      // Show success message or navigate back
      navigate('/settings/profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (type: 'avatar' | 'banner') => {
    // Simulate image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you'd upload to a service and get back a URL
        const mockUrl = URL.createObjectURL(file);
        if (type === 'avatar') {
          handleInputChange('avatar', mockUrl);
        } else {
          handleInputChange('profileBanner', mockUrl);
        }
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
                onClick={() => navigate('/settings/profile')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl px-6"
            >
              {saving ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Profile Images */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Profile Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner */}
                <div className="space-y-2">
                  <Label>Profile Banner</Label>
                  <div className="relative">
                    <div className="h-32 bg-muted rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => handleImageUpload('banner')}>
                      {formData.profileBanner ? (
                        <img
                          src={formData.profileBanner}
                          alt="Profile banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {formData.profileBanner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleInputChange('profileBanner', '')}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
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
                    <div className="relative group cursor-pointer" onClick={() => handleImageUpload('avatar')}>
                      <Avatar className="size-20 border-4 border-background">
                        <AvatarImage src={formData.avatar ?? undefined} alt="Profile picture" />
                        <AvatarFallback className="text-lg font-bold">
                          {formData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Click to change profile picture</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
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
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
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
                      value={formData.userName || ''}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
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
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
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
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
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
                <CardTitle className="flex items-center space-x-2">
                  <Link className="w-5 h-5" />
                  <span>Social Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="linkedIn"
                      value={formData.linkedInHandle || ''}
                      onChange={(e) => handleInputChange('linkedInHandle', e.target.value)}
                      className={cn("pl-10 rounded-xl", errors.linkedInHandle && "border-destructive")}
                      placeholder="https://www.linkedin.com/in/username"
                    />
                  </div>
                  {errors.linkedInHandle && (
                    <p className="text-sm text-destructive">{errors.linkedInHandle}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">X (Twitter) Profile</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="twitter"
                      value={formData.twitterHandle || ''}
                      onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                      className={cn("pl-10 rounded-xl", errors.twitterHandle && "border-destructive")}
                      placeholder="https://x.com/username"
                    />
                  </div>
                  {errors.twitterHandle && (
                    <p className="text-sm text-destructive">{errors.twitterHandle}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="github"
                      value={formData.githubHandle || ''}
                      onChange={(e) => handleInputChange('githubHandle', e.target.value)}
                      className={cn("pl-10 rounded-xl", errors.githubHandle && "border-destructive")}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  {errors.githubHandle && (
                    <p className="text-sm text-destructive">{errors.githubHandle}</p>
                  )}
                </div>
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
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileEditPage;