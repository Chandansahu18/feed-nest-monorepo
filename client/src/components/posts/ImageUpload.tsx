import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link, Image as ImageIcon, Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageTransform, setImageTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleUrlSubmit = () => {
    onChange(imageUrl);
    setIsUrlMode(false);
  };

  const handleRemove = () => {
    setImageUrl("");
    onChange("");
    setImageTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
    setIsEditing(false);
  };

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setImageTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

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

  // Image repositioning handlers
  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imageTransform.x,
      y: e.clientY - imageTransform.y
    });
  };

  const handleImageMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !isEditing) return;
    
    e.preventDefault();
    setImageTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  }, [isDragging, isEditing, dragStart]);

  const handleImageMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for mouse move and up
  useState(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleImageMouseMove);
      document.addEventListener('mouseup', handleImageMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleImageMouseMove);
        document.removeEventListener('mouseup', handleImageMouseUp);
      };
    }
  });

  const handleZoomIn = () => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 3)
    }));
  };

  const handleZoomOut = () => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5)
    }));
  };

  const handleRotate = () => {
    setImageTransform(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const handleReset = () => {
    setImageTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setImageTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
    }
  };

  if (value) {
    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg bg-muted">
          <img
            ref={imageRef}
            src={value}
            alt="Banner"
            className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-200 ${
              isEditing ? 'cursor-move' : 'cursor-default'
            }`}
            style={{
              transform: `translate(${imageTransform.x}px, ${imageTransform.y}px) scale(${imageTransform.scale}) rotate(${imageTransform.rotation}deg)`,
              transformOrigin: 'center center'
            }}
            onMouseDown={handleImageMouseDown}
            draggable={false}
          />
          
          {/* Editing overlay */}
          {isEditing && (
            <div className="absolute inset-0 bg-black/20 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
              <div className="bg-black/60 text-white px-3 py-1 rounded text-sm">
                Drag to reposition
              </div>
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleEditMode}
                className="h-8 w-8 p-0"
                title="Reposition image"
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <div className="flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
                title="Zoom out"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
                title="Zoom in"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="h-8 w-8 p-0"
                title="Rotate"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 w-8 p-0"
                title="Reset position"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Done/Cancel buttons for edit mode */}
        {isEditing && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={toggleEditMode}
              className="flex-1"
            >
              Done
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleReset();
                setIsEditing(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Transform info */}
        {isEditing && (
          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            Scale: {imageTransform.scale.toFixed(1)}x | Rotation: {imageTransform.rotation}°
          </div>
        )}
      </div>
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
              Supports: JPG, PNG, GIF, WebP
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
  );
};

export default ImageUpload;