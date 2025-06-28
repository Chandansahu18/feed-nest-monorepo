import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link, Image as ImageIcon, Crop } from "lucide-react";
import ImageCropper from "./ImageCropper";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    onChange(imageUrl);
    setIsUrlMode(false);
  };

  const handleRemove = () => {
    setImageUrl("");
    onChange("");
    setOriginalImage("");
  };

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
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
    fileInputRef.current?.click();
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    onChange(croppedImageUrl);
    setShowCropper(false);
    setOriginalImage("");
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage("");
  };

  const handleEditCrop = () => {
    if (value) {
      setOriginalImage(value);
      setShowCropper(true);
    }
  };

  if (value) {
    return (
      <>
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg bg-muted h-48 sm:h-56 md:h-64">
            <img
              src={value}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            
            {/* Control buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditCrop}
                className="h-8 w-8 p-0 shadow-lg"
                title="Crop image"
              >
                <Crop className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0 shadow-lg"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Crop hint */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium text-center">
                <div className="flex items-center justify-center gap-2">
                  <Crop className="w-4 h-4" />
                  Click crop to adjust image area
                </div>
              </div>
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
        <Label htmlFor="imageUrl">Image URL</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleUrlSubmit} 
              disabled={!imageUrl.trim()}
              className="flex-1 sm:flex-none"
            >
              Add
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsUrlMode(false)}
              className="flex-1 sm:flex-none"
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
          `}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-3 rounded-full transition-colors
              ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {isDragOver ? (
                <ImageIcon className="w-8 h-8" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-medium">
                {isDragOver ? 'Drop your image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, WebP • You can crop after upload
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsUrlMode(true)}
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
            <Upload className="w-4 h-4" />
            Browse Files
          </Button>
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
};

export default ImageUpload;