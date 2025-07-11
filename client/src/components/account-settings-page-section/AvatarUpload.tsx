import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Link,
  Crop,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import {
  useCloudinaryUpload,
  useCloudinaryUrlUpload,
  useCurrentUser,
} from "@/hooks/cloudinary/useCloudinaryUpload";
import { isImageUrl } from "@/utils/cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  fileName?: string;
}

const AvatarUpload = ({
  value,
  onChange,
  fileName,
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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
              imageType: "avatar",
              fileName: fileName || `avatar-${Date.now()}`,
             
            },
          },
          {
            onSuccess: (response) => {
              onChange(response.url);
              setIsUrlMode(false);
              clearError();
            },
            onError: (error) => {
              console.error("❌ Avatar URL upload failed:", error);
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
    onChange("");
    clearError();
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
            imageType: "avatar",
            fileName: fileName || `avatar-${Date.now()}`,
           
          },
        },
        {
          onSuccess: (response) => {
            onChange(response.url);
            clearError();
          },
          onError: (error) => {
            setUploadError(
              error.message || "Failed to upload avatar. Please try again."
            );
          },
        }
      );
    },
    [uploadToCloudinary, userId, fileName, onChange]
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
            <div className="relative overflow-hidden rounded-full bg-muted w-10 h-10">
              <div className="relative w-full h-full">
                {value ? (
                  <img
                    src={value}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="absolute top-0 right-0 flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-5 w-5 p-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Crop avatar"
                  disabled={isUploading}
                >
                  <Crop className="w-3 h-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="h-5 w-5 p-0 shadow-lg"
                  title="Remove avatar"
                  disabled={isUploading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isUrlMode) {
    return (
      <div className="space-y-3">
        {uploadError && <ErrorDisplay message={uploadError} />}

        <Label htmlFor="imageUrl">Avatar URL</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="imageUrl"
            placeholder="https://example.com/avatar.jpg"
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
            border-2 border-dashed rounded-full text-center transition-all cursor-pointer
            ${
              isDragOver
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-gray-300 hover:border-gray-400"
            }
            ${isUploading ? "opacity-50 pointer-events-none" : ""}
            w-10 h-10 mx-auto flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100
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

          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              <>
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center mb-0.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full transform -translate-y-0.5">
                    <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 leading-none">Click</div>
              </>
            )}
          </div>
        </div>

        {!isUploading && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setIsUrlMode(true);
                clearError();
              }}
              className="flex items-center gap-2"
              size="sm"
            >
              <Link className="w-4 h-4" />
              Add from URL
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AvatarUpload;