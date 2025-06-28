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
import { Save, Eye, Upload, Sparkles } from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useEnhanceContent } from "@/hooks/useEnhanceContent";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    postTitle: "",
    postDescription: "",
    postBannerImage: "",
    postTags: [] as string[],
    published: false,
  });

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: enhanceContent, isPending: isEnhancing } = useEnhanceContent();

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

  const handleSavePost = () => {
    if (!postData.postTitle.trim()) {
      alert("Please add a title for your post");
      return;
    }

    createPost(postData, {
      onSuccess: () => {
        navigate("/posts");
      }
    });
  };

  const handlePreview = () => {
    // Store post data in sessionStorage for preview
    sessionStorage.setItem("previewPost", JSON.stringify(postData));
    window.open("/posts/preview", "_blank");
  };

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
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleSavePost}
                disabled={isCreating}
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
                      <Label htmlFor="title">Post Title</Label>
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
                    />
                    <p className="text-xs text-muted-foreground">
                      {postData.postTitle.length}/250 characters
                    </p>
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {postData.postTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
                    <span>{postData.postTitle.length}/250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Content length:</span>
                    <span>{postData.postDescription.length} chars</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tags:</span>
                    <span>{postData.postTags.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={postData.published ? "default" : "secondary"}>
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