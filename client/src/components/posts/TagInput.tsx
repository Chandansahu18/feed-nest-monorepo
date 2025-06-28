import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const TagInput = ({ tags, onChange, maxTags = 10 }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      onChange([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const isAtLimit = tags.length >= maxTags;
  const isDuplicate = tags.includes(inputValue.trim());

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isAtLimit}
          className={`flex-1 ${isAtLimit ? "opacity-50" : ""}`}
        />
        <Button
          onClick={addTag}
          disabled={!inputValue.trim() || isDuplicate || isAtLimit}
          size="sm"
          className="shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="ml-2 sm:hidden">Add Tag</span>
        </Button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
        <p className={`text-xs ${isAtLimit ? 'text-red-500' : tags.length > maxTags * 0.8 ? 'text-orange-500' : 'text-muted-foreground'}`}>
          {tags.length}/{maxTags} tags • Press Enter to add a tag
        </p>
        <div className="flex gap-2">
          {isDuplicate && inputValue.trim() && (
            <span className="text-xs text-orange-500">Tag already exists</span>
          )}
          {isAtLimit && (
            <span className="text-xs text-red-500">Tag limit reached</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagInput;