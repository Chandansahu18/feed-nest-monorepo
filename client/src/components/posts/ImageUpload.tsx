import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [isUrlMode, setIsUrlMode] = useState(false);

  const handleUrlSubmit = () => {
    onChange(imageUrl);
    setIsUrlMode(false);
  };

  const handleRemove = () => {
    setImageUrl("");
    onChange("");
  };

  if (value) {
    return (
      <div className="relative">
        <img
          src={value}
          alt="Banner"
          className="w-full h-48 object-cover rounded-lg"
        />
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (isUrlMode) {
    return (
      <div className="space-y-3">
        <Label htmlFor="imageUrl">Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
            Add
          </Button>
          <Button variant="outline" onClick={() => setIsUrlMode(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground mb-4">
        Add a banner image to make your post stand out
      </p>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => setIsUrlMode(true)}>
          <Link className="w-4 h-4 mr-2" />
          Add URL
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;