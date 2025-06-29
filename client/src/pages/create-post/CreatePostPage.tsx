import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import TiptapEditor from "@/components/editor/TiptapEditor";
import ImageUpload from "@/components/posts/ImageUpload";
import TagInput from "@/components/posts/TagInput";
import { Save, Eye, Upload, Sparkles, ArrowLeft, Check, User, AlertCircle } from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useEnhanceContent } from "@/hooks/useEnhanceContent";
import { useCurrentUser } from "@/hooks/useCloudinaryUpload";

interface PostData {
  postTitle: string;
  postDescription: string;
  postBannerImage: string;
  postTags: string[];
  published: boolean;
}

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [createdPost, setCreatedPost] = useState<PostData | null>(null);
  const [postData, setPostData] = useState<PostData>({
    postTitle: "",
    postDescription: "",
    postBannerImage: "",
    postTags: [],
    published: false,
  });

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: enhanceContent, isPending: isEnhancing } = useEnhanceContent();
  const { userId } = useCurrentUser();

  // Validation limits
  const TITLE_MIN_LENGTH = 5;
  const TITLE_MAX_LENGTH = 250;
  const DESCRIPTION_MIN_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 5000;
  const MAX_TAGS = 10;

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setPostData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnhanceTitle = () => {
    if (postData.postTitle.trim()) {
      enhanceContent(
        { title: postData.postTitle },
        {
          onSuccess: (enhancedTitle) => {
            setPostData(prev => ({ ...prev, postTitle: enhancedTitle }));
          }
        }
      );
    }
  };

  const handleEnhanceDescription = () => {
    if (postData.postDescription.trim()) {
      enhanceContent(
        { blog: postData.postDescription },
        {
          onSuccess: (enhancedDescription) => {
            setPostData(prev => ({ ...prev, postDescription: enhancedDescription }));
          }
        }
      );
    }
  };

  const validatePost = () => {
    const errors = [];
    
    if (!postData.postTitle.trim()) {
      errors.push("Title is required");
    } else if (postData.postTitle.length < TITLE_MIN_LENGTH) {
      errors.push(`Title must be at least ${TITLE_MIN_LENGTH} characters`);
    } else if (postData.postTitle.length > TITLE_MAX_LENGTH) {
      errors.push(`Title must not exceed ${TITLE_MAX_LENGTH} characters`);
    }

    if (postData.postDescription.length > 0 && postData.postDescription.length < DESCRIPTION_MIN_LENGTH) {
      errors.push(`Description must be at least ${DESCRIPTION_MIN_LENGTH} characters if provided`);
    } else if (postData.postDescription.length > DESCRIPTION_MAX_LENGTH) {
      errors.push(`Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`);
    }

    if (postData.postTags.length > MAX_TAGS) {
      errors.push(`Maximum ${MAX_TAGS} tags allowed`);
    }

    return errors;
  };

  const handleSavePost = () => {
    const validationErrors = validatePost();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    createPost(postData, {
      onSuccess: () => {
        setCreatedPost(postData);
        setShowPreview(true);
      }
    });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  const handleGoToPosts = () => {
    navigate("/posts");
  };

  const getCharacterCountColor = (current: number, max: number) => {
    if (current > max * 0.9) return "text-red-500";
    if (current > max * 0.8) return "text-orange-500";
    return "text-muted-foreground";
  };

  // Check if Cloudinary is configured
  const isCloudinaryConfigured = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Preview Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleBackToEdit}
                  className="flex items-center gap-3 w-full sm:w-auto rounded-xl transition-all duration-200 hover:scale-105 px-6 py-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Edit
                </Button>
                <div className="w-full sm:w-auto">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Post Preview</h1>
                  {createdPost && (
                    <div className="flex items-center gap-3 mt-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <p className="text-green-600 font-medium text-base sm:text-lg">Post created successfully!</p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleGoToPosts}
                className="flex items-center gap-3 w-full sm:w-auto rounded-xl transition-all duration-200 hover:scale-105 px-6 py-3"
              >
                View All Posts
              </Button>
            </div>

            {/* Preview Content */}
            <Card className="mb-12 rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                {/* Banner Image */}
                {postData.postBannerImage && (
                  <div className="mb-8 sm:mb-10">
                    <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={postData.postBannerImage}
                        alt="Post banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{postData.postTitle}</h1>

                {/* Tags */}
                {postData.postTags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-8 sm:mb-10">
                    {postData.postTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm sm:text-base rounded-xl px-4 py-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Content */}
                {postData.postDescription && (
                  <div 
                    className="prose prose-base sm:prose-lg lg:prose-xl max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: postData.postDescription }}
                  />
                )}

                {/* Status */}
                <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t">
                  <div className="flex items-center gap-3">
                    <span className="text-base text-muted-foreground">Status:</span>
                    <Badge variant={postData.published ? "default" : "secondary"} className="rounded-xl px-4 py-2">
                      {postData.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Cloudinary Configuration Warning */}
          {!isCloudinaryConfigured && (
            <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 text-lg">Cloudinary Configuration Required</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    To upload images directly to Cloudinary, please add the following to your .env file:
                  </p>
                  <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg text-sm font-mono text-yellow-800 dark:text-yellow-200">
                    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name<br/>
                    VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3">
                    You can still use image URLs without this configuration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12">
            <div className="w-full sm:w-auto space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold">Create New Post</h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Share your thoughts with the world
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex items-center gap-3 w-full sm:w-auto rounded-xl transition-all duration-200 hover:scale-105 px-6 py-3"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleSavePost}
                disabled={isCreating}
                className="flex items-center gap-3 w-full sm:w-auto rounded-xl transition-all duration-200 hover:scale-105 px-6 py-3"
              >
                <Save className="w-4 h-4" />
                {isCreating ? "Saving..." : "Save Post"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Banner Image */}
              <Card className="rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-xl sm:text-2xl">
                    <div className="flex items-center gap-3">
                      <Upload className="w-6 h-6" />
                      Banner Image
                    </div>
                    <Badge variant="outline" className="text-sm rounded-xl w-fit px-3 py-1">16:9 Ratio</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <ImageUpload
                    value={postData.postBannerImage}
                    onChange={(url) => handleInputChange("postBannerImage", url)}
                    imageType="banner"
                    fileName="banner-image"
                  />
                  {isCloudinaryConfigured && (
                    <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                      Images are automatically uploaded to: postImageFiles/{userId}/postBannerImage/
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Title */}
              <Card className="rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm transition-all duration-300 hover:shadow-md">
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <Label htmlFor="title" className="text-base sm:text-lg font-semibold">Post Title *</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnhanceTitle}
                        disabled={isEnhancing || !postData.postTitle.trim()}
                        className="flex items-center gap-2 text-sm w-full sm:w-auto rounded-xl transition-all duration-200 hover:scale-105 px-4 py-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        {isEnhancing ? "Enhancing..." : "Enhance"}
                      </Button>
                    </div>
                    <Input
                      id="title"
                      placeholder="Enter your post title..."
                      value={postData.postTitle}
                      onChange={(e) => handleInputChange("postTitle", e.target.value)}
                      className="text-lg sm:text-xl font-semibold rounded-xl py-4 px-4"
                      maxLength={TITLE_MAX_LENGTH}
                    />
                    <p className={`text-sm ${getCharacterCountColor(postData.postTitle.length, TITLE_MAX_LENGTH)} mt-2`}>
                      {postData.postTitle.length}/{TITLE_MAX_LENGTH} characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="text-xl sm:text-2xl">Content</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEnhanceDescription}
                      disabled={isEnhancing || !postData.postDescription.trim()}
                      className="flex items-center gap-2 text-sm w-full sm:w-auto rounded-xl transition-all duration-200 hover:scale-105 px-4 py-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isEnhancing ? "Enhancing..." : "Enhance"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <TiptapEditor
                    content={postData.postDescription}
                    onChange={(content) => handleInputChange("postDescription", content)}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                  />
                  {isCloudinaryConfigured && (
                    <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                      Post images will be uploaded to: postImageFiles/{userId}/
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Publish Settings */}
              <Card className="rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl">Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-6">
                  <div className="flex items-start sm:items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="published" className="text-base sm:text-lg font-medium">Publish immediately</Label>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Make this post visible to everyone
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={postData.published}
                      onCheckedChange={(checked:boolean) => handleInputChange("published", checked)}
                    />
                  </div>
                  {!postData.published && (
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        This post will be saved as a draft
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl">Tags</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <TagInput
                    tags={postData.postTags}
                    onChange={(tags) => handleInputChange("postTags", tags)}
                    maxTags={MAX_TAGS}
                  />
                </CardContent>
              </Card>

              {/* Post Stats */}
              <Card className="rounded-2xl shadow-lg border-0 lg:border lg:shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl">Post Statistics</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex justify-between text-sm sm:text-base py-2">
                    <span className="font-medium">Title length:</span>
                    <span className={getCharacterCountColor(postData.postTitle.length, TITLE_MAX_LENGTH)}>
                      {postData.postTitle.length}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base py-2">
                    <span className="font-medium">Content length:</span>
                    <span className={getCharacterCountColor(postData.postDescription.length, DESCRIPTION_MAX_LENGTH)}>
                      {postData.postDescription.length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base py-2">
                    <span className="font-medium">Tags:</span>
                    <span className={postData.postTags.length >= MAX_TAGS ? 'text-red-500' : postData.postTags.length > MAX_TAGS * 0.8 ? 'text-orange-500' : 'text-muted-foreground'}>
                      {postData.postTags.length}/{MAX_TAGS}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base py-2">
                    <span className="font-medium">Status:</span>
                    <Badge variant={postData.published ? "default" : "secondary"} className="text-sm rounded-xl px-3 py-1">
                      {postData.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePostPage;