import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Highlighter,
} from 'lucide-react';
import { useCloudinaryUpload, useCloudinaryUrlUpload, useCurrentUser } from '@/hooks/useCloudinaryUpload';
import { useRef } from 'react';
import { isImageUrl } from '@/utils/cloudinary';

interface EditorToolbarProps {
  editor: Editor;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadToCloudinary, isPending: isFileUploading } = useCloudinaryUpload();
  const { mutate: uploadUrlToCloudinary, isPending: isUrlUploading } = useCloudinaryUrlUpload();
  const { userId } = useCurrentUser();

  const isUploading = isFileUploading || isUrlUploading;

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    uploadToCloudinary(
      { 
        file, 
        options: { 
          userId, 
          imageType: 'post',
          fileName: `editor-image-${Date.now()}`
        } 
      },
      {
        onSuccess: (response) => {
          editor.chain().focus().setImage({ src: response.url }).run();
        },
        onError: (error) => {
          console.error('Failed to upload image:', error);
          alert('Failed to upload image. Please try again.');
        }
      }
    );

    // Reset input
    e.target.value = '';
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      // Check if it's an image URL
      if (isImageUrl(url)) {
        // Check if Cloudinary is configured
        const isCloudinaryConfigured = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        
        if (isCloudinaryConfigured) {
          console.log('🔗 Uploading image URL to Cloudinary:', url);
          
          uploadUrlToCloudinary(
            { 
              url, 
              options: { 
                userId, 
                imageType: 'post',
                fileName: `toolbar-url-${Date.now()}`
              } 
            },
            {
              onSuccess: (response) => {
                console.log('✅ Toolbar URL upload successful:', response.url);
                editor.chain().focus().setImage({ src: response.url }).run();
              },
              onError: (error) => {
                console.error('❌ Toolbar URL upload failed, using original URL:', error);
                editor.chain().focus().setImage({ src: url }).run();
              }
            }
          );
        } else {
          // If Cloudinary not configured, insert as image directly
          editor.chain().focus().setImage({ src: url }).run();
        }
      } else {
        // Otherwise, insert as link
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Text Formatting */}
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Headings */}
      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment */}
      <Button
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Media & Links */}
      <Button
        variant="ghost"
        size="sm"
        onClick={addLink}
        title="Add link or image URL (auto-uploads images to Cloudinary)"
      >
        <Link className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        disabled={isUploading}
        title="Upload image to Cloudinary"
      >
        <Image className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>

      {/* Upload status indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
          <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin" />
          {isUrlUploading ? 'Uploading URL...' : 'Uploading...'}
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;