import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  Link,
  Image as ImageIcon,
  Crop,
  Loader2,
  AlertCircle,
} from "lucide-react";
import ImageCropper from "./ImageCropper";
import {
  useCloudinaryUpload,
  useCloudinaryUrlUpload,
  useCurrentUser,
} from "@/hooks/useCloudinaryUpload";
import { isImageUrl } from "@/utils/cloudinary";
import axios from "axios";

interface ImageUploadProps {
  value: string;
  onChange: (response: string) => void;
  onRemove: () => void;
  imageType?: "banner" | "post" | "avatar";
  fileName?: string;
}

const ImageUpload = ({
  value,
  onChange,
  onRemove, // This prop is passed from parent
  imageType = "banner",
  fileName,
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState("");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadToCloudinary, isPending: isFileUploading } =
    useCloudinaryUpload();

  const { mutate: uploadUrlToCloudinary, isPending: isUrlUploading } =
    useCloudinaryUrlUpload();
  const { userId } = useCurrentUser();

  const isUploading = isFileUploading || isUrlUploading;

  const clearError = () => setUploadError("");

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setUploadError("Please enter a valid image URL");
      return;
    }

    try {
      new URL(imageUrl);

      const isCloudinaryConfigured =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (isCloudinaryConfigured && isImageUrl(imageUrl)) {
        uploadUrlToCloudinary(
          {
            url: imageUrl,
            options: {
              userId,
              imageType,
              fileName: fileName || `url-${imageType}-${Date.now()}`,
            },
          },
          {
            onSuccess: (response) => {
              onChange(response.url);
              setIsUrlMode(false);
              clearError();
            },
            onError: () => {
              onChange(imageUrl);
              setIsUrlMode(false);
              clearError();
            },
          }
        );
      } else {
        onChange(imageUrl);
        setIsUrlMode(false);
        clearError();
      }
    } catch {
      setUploadError("Please enter a valid URL");
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    setOriginalImage("");
    clearError();
    onRemove();
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      clearError();

      if (!file) {
        setUploadError("No file selected");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }
      uploadToCloudinary(
        {
          file,
          options: {
            userId,
            imageType,
            fileName: fileName || `${imageType}-${Date.now()}`,
          },
        },
        {
          onSuccess: (response) => {
            onChange(response.url);
            clearError();
          },
          onError: (error) => {
            setUploadError(
              error.message || "Failed to upload image. Please try again."
            );
          },
        }
      );
    },
    [uploadToCloudinary, userId, imageType, fileName, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    clearError();
    fileInputRef.current?.click();
  };

  const handleEditCrop = () => {
    if (value) {
      setOriginalImage(value);
      setShowCropper(true);
      clearError();
    }
  };

const handleCropComplete = (croppedImageUrl: string) => {
  clearError();

  axios.get(croppedImageUrl, { responseType: 'blob' })
    .then((response) => {
      const blob = response.data;
      const file = new File([blob], `${imageType}-cropped.jpg`, {
        type: "image/jpeg",
      });

      uploadToCloudinary(
        {
          file,
          options: {
            userId,
            imageType,
            fileName: fileName || `${imageType}-cropped-${Date.now()}`,
          },
        },
        {
          onSuccess: (response) => {
            onChange(response.url);
            setShowCropper(false);
            setOriginalImage("");
            clearError();
          },
          onError: (error) => {
            setUploadError(
              error.message ||
                "Failed to upload cropped image. Please try again."
            );
            setShowCropper(false);
            setOriginalImage("");
          },
        }
      );
    })
    .catch((error) => {
      console.error("Error processing cropped image:", error);
      setUploadError("Error processing image. Please try again.");
      setShowCropper(false);
      setOriginalImage("");
    });
};

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage("");
    clearError();
  };

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearError}
        className="ml-auto h-auto p-1 text-red-700 hover:text-red-900"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );

  if (value) {
    return (
      <>
        <div className="space-y-3">
          {uploadError && <ErrorDisplay message={uploadError} />}

          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <div
                className={`relative ${
                  imageType === "banner" ? "h-48 sm:h-56 md:h-64" : "h-auto"
                }`}
              >
                <img
                  src={value}
                  alt={imageType === "banner" ? "Banner" : "Post image"}
                  className={`w-full h-full ${
                    imageType === "banner" ? "object-cover" : "object-contain"
                  }`}
                  style={imageType === "banner" ? { aspectRatio: "16/9" } : {}}
                  onError={() => setUploadError("Failed to load image")}
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditCrop}
                  className="h-8 w-8 p-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Crop image"
                  disabled={isUploading}
                >
                  <Crop className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0 shadow-lg"
                  title="Remove image"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">
                      {isUrlUploading ? "Uploading URL..." : "Uploading..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showCropper && (
          <ImageCropper
            imageSrc={originalImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </>
    );
  }

  if (isUrlMode) {
    return (
      <div className="space-y-3">
        {uploadError && <ErrorDisplay message={uploadError} />}

        <Label htmlFor="imageUrl">Image URL</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              clearError();
            }}
            className="flex-1"
            disabled={isUploading}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleUrlSubmit}
              disabled={!imageUrl.trim() || isUploading}
              className="flex-1 sm:flex-none"
            >
              {isUrlUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Add"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsUrlMode(false);
                clearError();
              }}
              className="flex-1 sm:flex-none"
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {uploadError && <ErrorDisplay message={uploadError} />}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
      border-2 border-dashed text-center transition-all cursor-pointer
      ${
        imageType === "avatar"
          ? "rounded-full size-20 p-2"
          : "rounded-lg p-6 sm:p-8"
      }
      ${
        isDragOver
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }
      ${isUploading ? "opacity-50 pointer-events-none" : ""}
    `}
          onClick={!isUploading ? handleBrowseClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div
            className={`flex flex-col items-center justify-center ${
              imageType === "avatar" ? "h-full w-full" : "space-y-4"
            }`}
          >
            <div
              className={`
          transition-colors
          ${imageType === "avatar" ? "p-2" : "p-3 rounded-full"}
          ${
            isDragOver
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }
        `}
            >
              {isUploading ? (
                <Loader2
                  className={`animate-spin ${
                    imageType === "avatar" ? "size-6" : "w-8 h-8"
                  }`}
                />
              ) : isDragOver ? (
                <ImageIcon
                  className={imageType === "avatar" ? "w-6 h-6" : "w-8 h-8"}
                />
              ) : (
                <Upload
                  className={imageType === "avatar" ? "w-6 h-6" : "w-8 h-8"}
                />
              )}
            </div>

            {imageType !== "avatar" && (
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-medium">
                  {isUploading
                    ? "Uploading to Cloudinary..."
                    : isDragOver
                    ? "Drop your image here"
                    : "Drag & drop an image here"}
                </p>
                {!isUploading && (
                  <>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      or click to browse files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG
                      {imageType === "banner" && " • Optimized for 16:9 ratio"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {!isUploading && imageType === "banner" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUrlMode(true);
                clearError();
              }}
              className="flex items-center gap-2 flex-1"
            >
              <Link className="w-4 h-4" />
              Add from URL
            </Button>
          </div>
        )}
      </div>

      {showCropper && (
        <ImageCropper
          imageSrc={originalImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
};

export default ImageUpload;