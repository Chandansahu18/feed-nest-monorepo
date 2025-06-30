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
import ImageUpload from "@/components/create-post-sections/ImageUpload";
import TagInput from "@/components/create-post-sections/TagInput";
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

const VALIDATION_LIMITS = {
  TITLE_MIN: 5,
  TITLE_MAX: 250,
  DESCRIPTION_MIN: 100,
  DESCRIPTION_MAX: 5000,
  MAX_TAGS: 10,
} as const;

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

  const [enhancementStates, setEnhancementStates] = useState({
    title: { isEnhancing: false, originalValue: "" },
    description: { isEnhancing: false, originalValue: "" },
  });

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { data, mutate: enhanceContent } = useEnhanceContent();

  // Debug log to see the structure
  console.log("Enhancement data:", data);

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEnhance = (type: "title" | "description") => {
    const content =
      type === "title" ? postData.postTitle : postData.postDescription;
    const contentStr = String(content || "").trim();

    if (!contentStr) return;

    setEnhancementStates((prev) => ({
      ...prev,
      [type]: { isEnhancing: true, originalValue: contentStr },
    }));

    const payload =
      type === "title" ? { title: contentStr } : { blog: contentStr };

    enhanceContent(payload, {
      onSuccess: (response) => {
        const enhancedContent = response?.data || "";

        setPostData((prev) => ({
          ...prev,
          [type === "title" ? "postTitle" : "postDescription"]: enhancedContent,
        }));

        setEnhancementStates((prev) => ({
          ...prev,
          [type]: { isEnhancing: false, originalValue: "" },
        }));
      },
      onError: (error) => {
        console.error(`Enhancement failed for ${type}:`, error);
        setEnhancementStates((prev) => ({
          ...prev,
          [type]: { isEnhancing: false, originalValue: "" },
        }));
      },
    });
  };

  const validatePost = () => {
    const errors = [];
    const { postTitle, postDescription, postTags } = postData;
    const { TITLE_MIN, TITLE_MAX, DESCRIPTION_MIN, DESCRIPTION_MAX, MAX_TAGS } =
      VALIDATION_LIMITS;

    // Ensure postTitle is a string before calling trim()
    const titleStr = String(postTitle || "");
    if (!titleStr.trim()) errors.push("Title is required");
    else if (titleStr.length < TITLE_MIN)
      errors.push(`Title must be at least ${TITLE_MIN} characters`);
    else if (titleStr.length > TITLE_MAX)
      errors.push(`Title must not exceed ${TITLE_MAX} characters`);

    // Ensure postDescription is a string before checking length
    const descriptionStr = String(postDescription || "");
    if (descriptionStr.length > 0 && descriptionStr.length < DESCRIPTION_MIN) {
      errors.push(
        `Description must be at least ${DESCRIPTION_MIN} characters if provided`
      );
    } else if (descriptionStr.length > DESCRIPTION_MAX) {
      errors.push(`Description must not exceed ${DESCRIPTION_MAX} characters`);
    }

    // Ensure postTags is an array before checking length
    const tagsArray = Array.isArray(postTags) ? postTags : [];
    if (tagsArray.length > MAX_TAGS)
      errors.push(`Maximum ${MAX_TAGS} tags allowed`);

    return errors;
  };

  const handleSavePost = () => {
    const validationErrors = validatePost();
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    createPost(postData, {
      onSuccess: () => {
        setCreatedPost(postData);
        setShowPreview(true);
      },
    });
  };

  const getCharacterCountColor = (current: number, max: number) => {
    if (current > max * 0.9) return "text-red-500";
    if (current > max * 0.8) return "text-orange-500";
    return "text-muted-foreground";
  };

  // Enhanced Button Component
  const EnhanceButton = ({
    onClick,
    disabled,
    type,
  }: {
    onClick: () => void;
    disabled: boolean;
    type: "title" | "description";
  }) => {
    const isCurrentlyEnhancing = enhancementStates[type].isEnhancing;
    const hasContent =
      type === "title"
        ? String(postData.postTitle || "").trim().length > 0
        : String(postData.postDescription || "").trim().length > 0;

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled || isCurrentlyEnhancing || !hasContent}
        className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <Sparkles
          className={`w-4 h-4 ${isCurrentlyEnhancing ? "animate-spin" : ""}`}
        />
        {isCurrentlyEnhancing ? "Enhancing..." : "Enhance"}
      </Button>
    );
  };

  const HeaderActions = ({ isPreview = false }: { isPreview?: boolean }) => (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {isPreview ? (
        <>
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </Button>
          <Button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            View All Posts
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            onClick={handleSavePost}
            disabled={isCreating}
            className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Save className="w-4 h-4" />
            {isCreating ? "Saving..." : "Save Post"}
          </Button>
        </>
      )}
    </div>
  );
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Fixed container that respects header/footer */}
        <div className="pt-20 pb-20 sm:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Preview Header */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                      Post Preview
                    </h1>
                    {createdPost && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        <p className="text-green-600 font-medium text-sm sm:text-base">
                          Post created successfully!
                        </p>
                      </div>
                    )}
                  </div>
                  <HeaderActions isPreview />
                </div>
              </div>

              {/* Preview Content */}
              <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl">
                <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
                  {postData.postBannerImage && (
                    <div className="mb-6 sm:mb-8">
                      <div
                        className="relative overflow-hidden rounded-xl"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <img
                          src={postData.postBannerImage}
                          alt="Post banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                    {postData.postTitle}
                  </h1>

                  {postData.postTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                      {postData.postTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="rounded-xl px-2 sm:px-3 py-1 text-xs sm:text-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {postData.postDescription && (
                    <div
                      className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-6 sm:mb-8 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: String(postData.postDescription || ""),
                      }}
                    />
                  )}

                  <div className="pt-6 sm:pt-8 border-t">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={postData.published ? "default" : "secondary"}
                        className="rounded-xl"
                      >
                        {postData.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Fixed container that respects header/footer */}
      <div className="pt-20 pb-20 sm:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" style={{ minWidth: "320px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Create New Post
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                    Share your thoughts with the world
                  </p>
                </div>
                <HeaderActions />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-6 lg:space-y-8">
                {/* Banner Image */}
                <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        Banner Image
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-xl w-fit text-xs sm:text-sm"
                      >
                        16:9 Ratio
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <ImageUpload
                      value={postData.postBannerImage}
                      onChange={(url) =>
                        handleInputChange("postBannerImage", url)
                      }
                      imageType="banner"
                      fileName="banner-image"
                    />
                  </CardContent>
                </Card>

                {/* Title */}
                <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                        <Label
                          htmlFor="title"
                          className="font-semibold text-sm sm:text-base lg:text-lg"
                        >
                          Post Title *
                        </Label>
                        <EnhanceButton
                          onClick={() => handleEnhance("title")}
                          disabled={enhancementStates.title.isEnhancing}
                          type="title"
                        />
                      </div>
                      <div className="relative">
                        <Input
                          id="title"
                          placeholder="Enter your post title..."
                          value={postData.postTitle}
                          onChange={(e) =>
                            handleInputChange("postTitle", e.target.value)
                          }
                          className={`text-base sm:text-lg lg:text-xl font-semibold rounded-xl py-3 sm:py-4 px-3 sm:px-4 min-h-[48px] sm:min-h-[56px] lg:min-h-[60px] transition-all duration-200 ${
                            enhancementStates.title.isEnhancing
                              ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                              : ""
                          }`}
                          maxLength={VALIDATION_LIMITS.TITLE_MAX}
                          disabled={enhancementStates.title.isEnhancing}
                        />
                        {enhancementStates.title.isEnhancing && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-xs sm:text-sm ${getCharacterCountColor(
                          String(postData.postTitle || "").length,
                          VALIDATION_LIMITS.TITLE_MAX
                        )}`}
                      >
                        {String(postData.postTitle || "").length}/
                        {VALIDATION_LIMITS.TITLE_MAX} characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <CardTitle className="text-base sm:text-lg lg:text-xl">
                        Content
                      </CardTitle>
                      <EnhanceButton
                        onClick={() => handleEnhance("description")}
                        disabled={enhancementStates.description.isEnhancing}
                        type="description"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                        <Label
                          htmlFor="description"
                          className="font-semibold text-sm sm:text-base lg:text-lg"
                        >
                          Post Description
                        </Label>
                        <EnhanceButton
                          onClick={() => handleEnhance("description")}
                          disabled={enhancementStates.description.isEnhancing}
                          type="description"
                        />
                      </div>

                      <div className="relative">
                        <div
                          className={`min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] transition-all duration-200 relative ${
                            enhancementStates.description.isEnhancing
                              ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                              : ""
                          }`}
                        >
                          {enhancementStates.description.isEnhancing ? (
                            <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center">
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                <span className="text-sm font-medium ">
                                  Enhancing content...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <TiptapEditor
                              content={postData.postDescription}
                              onChange={(content) =>
                                handleInputChange("postDescription", content)
                              }
                              maxLength={VALIDATION_LIMITS.DESCRIPTION_MAX}
                              
                            />
                          )}
                        </div>
                        <p
                          className={`text-xs sm:text-sm ${getCharacterCountColor(
                            String(postData.postDescription || "").length,
                            VALIDATION_LIMITS.DESCRIPTION_MAX
                          )}`}
                        >
                          {String(postData.postDescription || "").length}/
                          {VALIDATION_LIMITS.DESCRIPTION_MAX} characters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Publish Settings */}
                <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">
                      Publish Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <Label
                          htmlFor="published"
                          className="font-medium text-xs sm:text-sm lg:text-base"
                        >
                          Publish immediately
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Make this post visible to everyone
                        </p>
                      </div>
                      <Switch
                        id="published"
                        checked={postData.published}
                        onCheckedChange={(checked: boolean) =>
                          handleInputChange("published", checked)
                        }
                      />
                    </div>
                    {!postData.published && (
                      <div className="p-3 sm:p-4 bg-muted rounded-xl">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          This post will be saved as a draft
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <TagInput
                      tags={postData.postTags}
                      onChange={(tags) => handleInputChange("postTags", tags)}
                      maxTags={VALIDATION_LIMITS.MAX_TAGS}
                    />
                  </CardContent>
                </Card>

                {/* Post Stats */}
                <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">
                      Post Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    {[
                      {
                        label: "Title length",
                        current: String(postData.postTitle || "").length,
                        max: VALIDATION_LIMITS.TITLE_MAX,
                      },
                      {
                        label: "Content length",
                        current: String(postData.postDescription || "").length,
                        max: VALIDATION_LIMITS.DESCRIPTION_MAX,
                      },
                      {
                        label: "Tags",
                        current: Array.isArray(postData.postTags)
                          ? postData.postTags.length
                          : 0,
                        max: VALIDATION_LIMITS.MAX_TAGS,
                      },
                    ].map(({ label, current, max }) => (
                      <div
                        key={label}
                        className="flex justify-between text-xs sm:text-sm"
                      >
                        <span className="text-muted-foreground">{label}:</span>
                        <span className={getCharacterCountColor(current, max)}>
                          {current}/{max}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs sm:text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={postData.published ? "default" : "secondary"}
                        className="rounded-xl text-xs"
                      >
                        {postData.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mobile Save Button */}
            <div className="xl:hidden">
              <Button
                onClick={handleSavePost}
                disabled={isCreating}
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 hover:scale-105"
                size="lg"
              >
                {isCreating ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isCreating ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
