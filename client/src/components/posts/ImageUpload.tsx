import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link, Image as ImageIcon, Crop, Cloud, Loader2, AlertCircle } from "lucide-react";
import ImageCropper from "./ImageCropper";
import { useCloudinaryUpload, useCurrentUser } from "@/hooks/useCloudinaryUpload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  imageType?: 'banner' | 'post';
  fileName?: string;
}

const ImageUpload = ({ 
  value, 
  onChange, 
  imageType = 'banner',
  fileName 
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState("");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadToCloudinary, isPending: isUploading } = useCloudinaryUpload();
  const { userId } = useCurrentUser();

  const clearError = () => setUploadError("");

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setUploadError("Please enter a valid image URL");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(imageUrl);
      onChange(imageUrl);
      setIsUrlMode(false);
      clearError();
    } catch {
      setUploadError("Please enter a valid URL");
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    onChange("");
    setOriginalImage("");
    clearError();
  };

  const handleFileSelect = useCallback((file: File) => {
    clearError();
    
    if (!file) {
      setUploadError("No file selected");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setShowCropper(true);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

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

  const handleCropComplete = (croppedImageUrl: string) => {
    clearError();
    
    // Convert cropped image URL to File for Cloudinary upload
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${imageType}-image.jpg`, { type: 'image/jpeg' });
        
        uploadToCloudinary(
          { 
            file, 
            options: { 
              userId, 
              imageType,
              fileName: fileName || `${imageType}-${Date.now()}`
            } 
          },
          {
            onSuccess: (response) => {
              console.log('✅ Upload successful:', response.secure_url);
              onChange(response.secure_url);
              setShowCropper(false);
              setOriginalImage("");
              clearError();
            },
            onError: (error) => {
              console.error('❌ Upload failed:', error);
              setUploadError(error.message || 'Failed to upload image. Please try again.');
              setShowCropper(false);
              setOriginalImage("");
            }
          }
        );
      })
      .catch(error => {
        console.error('Error processing cropped image:', error);
        setUploadError('Error processing image. Please try again.');
        setShowCropper(false);
        setOriginalImage("");
      });
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage("");
    clearError();
  };

  const handleEditCrop = () => {
    if (value) {
      setOriginalImage(value);
      setShowCropper(true);
      clearError();
    }
  };

  const handleDirectUpload = (file: File) => {
    clearError();
    
    uploadToCloudinary(
      { 
        file, 
        options: { 
          userId, 
          imageType,
          fileName: fileName || `${imageType}-${Date.now()}`
        } 
      },
      {
        onSuccess: (response) => {
          console.log('✅ Direct upload successful:', response.secure_url);
          onChange(response.secure_url);
          clearError();
        },
        onError: (error) => {
          console.error('❌ Direct upload failed:', error);
          setUploadError(error.message || 'Failed to upload image. Please try again.');
        }
      }
    );
  };

  // Error display component
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
              {/* Fixed dimensions for banner images */}
              <div className={`relative ${imageType === 'banner' ? 'h-48 sm:h-56 md:h-64' : 'h-auto'}`}>
                <img
                  src={value}
                  alt={imageType === 'banner' ? 'Banner' : 'Post image'}
                  className={`w-full h-full ${imageType === 'banner' ? 'object-cover' : 'object-contain'}`}
                  style={imageType === 'banner' ? { aspectRatio: '16/9' } : {}}
                  onError={() => setUploadError('Failed to load image')}
                />
              </div>
              
              {/* Control buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditCrop}
                  className="h-8 w-8 p-0 shadow-lg"
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

              {/* Upload indicator */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Uploading to Cloudinary...</span>
                  </div>
                </div>
              )}

              {/* Success indicator */}
              {!isUploading && (
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-green-600/90 text-white px-3 py-2 rounded-lg text-sm font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Cloud className="w-4 h-4" />
                      Stored in Cloudinary • Click crop to adjust
                    </div>
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
              Add
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
        
        {/* Configuration check */}
        {!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Cloudinary not configured. Please add VITE_CLOUDINARY_CLOUD_NAME to your .env file.</span>
            </div>
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer
            ${isDragOver 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
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
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-3 rounded-full transition-colors
              ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isDragOver ? (
                <ImageIcon className="w-8 h-8" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-medium">
                {isUploading 
                  ? 'Uploading to Cloudinary...' 
                  : isDragOver 
                    ? 'Drop your image here' 
                    : 'Drag & drop an image here'
                }
              </p>
              {!isUploading && (
                <>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, GIF, WebP • Max 10MB
                    {imageType === 'banner' && ' • Optimized for 16:9 ratio'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Alternative Options */}
        {!isUploading && (
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
            <Button 
              variant="outline" 
              onClick={handleBrowseClick}
              className="flex items-center gap-2 flex-1"
            >
              <Cloud className="w-4 h-4" />
              Upload to Cloudinary
            </Button>
          </div>
        )}

        {/* Quick upload option */}
        {!isUploading && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Quick upload (no cropping):
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleDirectUpload(file);
                }
              }}
              className="hidden"
              id="quick-upload"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('quick-upload')?.click()}
              className="text-xs"
            >
              <Upload className="w-3 h-3 mr-1" />
              Direct Upload
            </Button>
          </div>
        )}

        {/* Debug info (only in development) */}
        {import.meta.env.DEV && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <p>Debug: User ID: {userId}</p>
            <p>Banner path: postImages/postBannerImages/{userId}/</p>
            <p>Post images path: postImages/{userId}/</p>
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