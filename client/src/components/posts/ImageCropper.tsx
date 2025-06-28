import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crop, RotateCcw, Check, X } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Initialize crop area when image loads
  useEffect(() => {
    if (imageLoaded && imageDimensions.width > 0) {
      const aspectRatio = 16 / 9; // Banner aspect ratio
      const containerWidth = imageDimensions.width;
      const containerHeight = imageDimensions.height;
      
      let cropWidth = containerWidth * 0.8;
      let cropHeight = cropWidth / aspectRatio;
      
      // Adjust if crop height exceeds container
      if (cropHeight > containerHeight * 0.8) {
        cropHeight = containerHeight * 0.8;
        cropWidth = cropHeight * aspectRatio;
      }
      
      setCropArea({
        x: (containerWidth - cropWidth) / 2,
        y: (containerHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  }, [imageLoaded, imageDimensions]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight
      });
      setImageLoaded(true);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    } else if (action === 'resize' && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setDragStart({ x, y });
    }
  }, [cropArea]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || (!isDragging && !isResizing)) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const newX = Math.max(0, Math.min(x - dragStart.x, imageDimensions.width - cropArea.width));
      const newY = Math.max(0, Math.min(y - dragStart.y, imageDimensions.height - cropArea.height));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      setCropArea(prev => {
        let newArea = { ...prev };
        
        switch (resizeHandle) {
          case 'nw':
            newArea.x = Math.max(0, prev.x + deltaX);
            newArea.y = Math.max(0, prev.y + deltaY);
            newArea.width = Math.max(50, prev.width - deltaX);
            newArea.height = Math.max(50, prev.height - deltaY);
            break;
          case 'ne':
            newArea.y = Math.max(0, prev.y + deltaY);
            newArea.width = Math.max(50, prev.width + deltaX);
            newArea.height = Math.max(50, prev.height - deltaY);
            break;
          case 'sw':
            newArea.x = Math.max(0, prev.x + deltaX);
            newArea.width = Math.max(50, prev.width - deltaX);
            newArea.height = Math.max(50, prev.height + deltaY);
            break;
          case 'se':
            newArea.width = Math.max(50, prev.width + deltaX);
            newArea.height = Math.max(50, prev.height + deltaY);
            break;
        }
        
        // Ensure crop area stays within image bounds
        newArea.width = Math.min(newArea.width, imageDimensions.width - newArea.x);
        newArea.height = Math.min(newArea.height, imageDimensions.height - newArea.y);
        
        return newArea;
      });
      
      setDragStart({ x, y });
    }
  }, [isDragging, isResizing, dragStart, resizeHandle, imageDimensions, cropArea.width, cropArea.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleCrop = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a new image element for cropping
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Calculate scale factors
      const scaleX = img.naturalWidth / imageDimensions.width;
      const scaleY = img.naturalHeight / imageDimensions.height;
      
      // Set canvas size to crop area
      canvas.width = cropArea.width * scaleX;
      canvas.height = cropArea.height * scaleY;
      
      // Draw cropped image
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl);
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.src = imageSrc;
  };

  const resetCrop = () => {
    if (imageDimensions.width > 0) {
      const aspectRatio = 16 / 9;
      const containerWidth = imageDimensions.width;
      const containerHeight = imageDimensions.height;
      
      let cropWidth = containerWidth * 0.8;
      let cropHeight = cropWidth / aspectRatio;
      
      if (cropHeight > containerHeight * 0.8) {
        cropHeight = containerHeight * 0.8;
        cropWidth = cropHeight * aspectRatio;
      }
      
      setCropArea({
        x: (containerWidth - cropWidth) / 2,
        y: (containerHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Crop Banner Image</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetCrop}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Crop Area */}
        <div className="p-4 max-h-[calc(90vh-140px)] overflow-auto">
          <div 
            ref={containerRef}
            className="relative inline-block max-w-full"
            style={{ userSelect: 'none' }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full h-auto block"
              onLoad={handleImageLoad}
              draggable={false}
            />
            
            {imageLoaded && (
              <>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />
                
                {/* Crop Area */}
                <div
                  className="absolute border-2 border-white shadow-lg cursor-move"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                    backgroundColor: 'transparent'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'drag')}
                >
                  {/* Crop area content (transparent) */}
                  <div className="w-full h-full relative">
                    {/* Resize handles */}
                    <div
                      className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-nw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-ne-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-sw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-se-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
                    />
                  </div>
                </div>

                {/* Grid lines */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height
                  }}
                >
                  {/* Rule of thirds grid */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Drag to move • Drag corners to resize • Recommended ratio: 16:9
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleCrop} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Apply Crop
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCropper;