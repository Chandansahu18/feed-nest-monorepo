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
import { Save, Eye, Upload, Sparkles, ArrowLeft, Check } from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useEnhanceContent } from "@/hooks/useEnhanceContent";

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
    const validationErrors = validatePost();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }
    
    setShowPreview(true);
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  const handleGoToPosts = () => {
    navigate("/posts");
  };

  const isFormValid = () => {
    return validatePost().length === 0;
  };

  const getCharacterCountColor = (current: number, max: number, min?: number) => {
    if (min && current < min && current > 0) return "text-orange-500";
    if (current > max * 0.9) return "text-red-500";
    if (current > max * 0.8) return "text-orange-500";
    return "text-muted-foreground";
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Preview Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleBackToEdit}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Edit
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Post Preview</h1>
                  {createdPost && (
                    <div className="flex items-center gap-2 mt-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <p className="text-green-600 font-medium">Post created successfully!</p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleGoToPosts}
                className="flex items-center gap-2"
              >
                View All Posts
              </Button>
            </div>

            {/* Preview Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                {/* Banner Image */}
                {postData.postBannerImage && (
                  <div className="mb-6">
                    <img
                      src={postData.postBannerImage}
                      alt="Post banner"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">{postData.postTitle}</h1>

                {/* Tags */}
                {postData.postTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {postData.postTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Content */}
                {postData.postDescription && (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: postData.postDescription }}
                  />
                )}

                {/* Status */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={postData.published ? "default" : "secondary"}>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Create New Post</h1>
              <p className="text-muted-foreground mt-2">
                Share your thoughts with the world
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!isFormValid()}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleSavePost}
                disabled={isCreating || !isFormValid()}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isCreating ? "Saving..." : "Save Post"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Banner Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Banner Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={postData.postBannerImage}
                    onChange={(url) => handleInputChange("postBannerImage", url)}
                  />
                </CardContent>
              </Card>

              {/* Title */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title">Post Title *</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnhanceTitle}
                        disabled={isEnhancing || !postData.postTitle.trim()}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        {isEnhancing ? "Enhancing..." : "Enhance"}
                      </Button>
                    </div>
                    <Input
                      id="title"
                      placeholder="Enter your post title..."
                      value={postData.postTitle}
                      onChange={(e) => handleInputChange("postTitle", e.target.value)}
                      className="text-lg font-semibold"
                      maxLength={TITLE_MAX_LENGTH}
                    />
                    <div className="flex justify-between items-center">
                      <p className={`text-xs ${getCharacterCountColor(postData.postTitle.length, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH)}`}>
                        {postData.postTitle.length}/{TITLE_MAX_LENGTH} characters
                        {postData.postTitle.length < TITLE_MIN_LENGTH && postData.postTitle.length > 0 && 
                          ` (minimum ${TITLE_MIN_LENGTH})`
                        }
                      </p>
                      {postData.postTitle.length < TITLE_MIN_LENGTH && postData.postTitle.length > 0 && (
                        <span className="text-xs text-orange-500">Too short</span>
                      )}
                      {postData.postTitle.length > TITLE_MAX_LENGTH * 0.9 && (
                        <span className="text-xs text-red-500">Approaching limit</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Content</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEnhanceDescription}
                      disabled={isEnhancing || !postData.postDescription.trim()}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isEnhancing ? "Enhancing..." : "Enhance"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TiptapEditor
                    content={postData.postDescription}
                    onChange={(content) => handleInputChange("postDescription", content)}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <p className={`text-xs ${getCharacterCountColor(postData.postDescription.length, DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH)}`}>
                      {postData.postDescription.length}/{DESCRIPTION_MAX_LENGTH} characters
                      {postData.postDescription.length > 0 && postData.postDescription.length < DESCRIPTION_MIN_LENGTH && 
                        ` (minimum ${DESCRIPTION_MIN_LENGTH})`
                      }
                    </p>
                    {postData.postDescription.length > 0 && postData.postDescription.length < DESCRIPTION_MIN_LENGTH && (
                      <span className="text-xs text-orange-500">Too short</span>
                    )}
                    {postData.postDescription.length > DESCRIPTION_MAX_LENGTH * 0.9 && (
                      <span className="text-xs text-red-500">Approaching limit</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="published">Publish immediately</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this post visible to everyone
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={postData.published}
                      onCheckedChange={(checked) => handleInputChange("published", checked)}
                    />
                  </div>
                  {!postData.published && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        This post will be saved as a draft
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={postData.postTags}
                    onChange={(tags) => handleInputChange("postTags", tags)}
                  />
                  {postData.postTags.length > MAX_TAGS * 0.8 && (
                    <p className={`text-xs mt-2 ${postData.postTags.length >= MAX_TAGS ? 'text-red-500' : 'text-orange-500'}`}>
                      {postData.postTags.length >= MAX_TAGS 
                        ? `Maximum ${MAX_TAGS} tags reached` 
                        : `Approaching tag limit (${postData.postTags.length}/${MAX_TAGS})`
                      }
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Post Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Title length:</span>
                    <span className={getCharacterCountColor(postData.postTitle.length, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH)}>
                      {postData.postTitle.length}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Content length:</span>
                    <span className={getCharacterCountColor(postData.postDescription.length, DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH)}>
                      {postData.postDescription.length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tags:</span>
                    <span className={postData.postTags.length >= MAX_TAGS ? 'text-red-500' : postData.postTags.length > MAX_TAGS * 0.8 ? 'text-orange-500' : 'text-muted-foreground'}>
                      {postData.postTags.length}/{MAX_TAGS}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={postData.published ? "default" : "secondary"}>
                      {postData.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Form Status:</span>
                      <Badge variant={isFormValid() ? "default" : "destructive"}>
                        {isFormValid() ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Validation Errors */}
              {!isFormValid() && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-300 text-sm">Validation Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                      {validatePost().map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePostPage;