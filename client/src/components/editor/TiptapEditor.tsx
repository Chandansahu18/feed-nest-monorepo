import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import EditorToolbar from './EditorToolbar';
import SlashCommands from './SlashCommands';
import { useCloudinaryUpload, useCloudinaryUrlUpload, useCurrentUser } from '@/hooks/useCloudinaryUpload';
import { isImageUrl } from '@/utils/cloudinary';
import './editor.css';
import {common, createLowlight} from 'lowlight'

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  maxLength?: number;
}

const TiptapEditor = ({ content, onChange, maxLength = 5000 }: TiptapEditorProps) => {
  const { mutate: uploadToCloudinary } = useCloudinaryUpload();
  const { mutate: uploadUrlToCloudinary } = useCloudinaryUrlUpload();
  const { userId } = useCurrentUser();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your post... Type '/' for commands",
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
        // Auto-detect and convert image URLs to images
        validate: (href) => {
          if (isImageUrl(href)) {
            // Check if Cloudinary is configured
            const isCloudinaryConfigured = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            
            if (isCloudinaryConfigured) {
              // Upload URL to Cloudinary first, then insert as image
              console.log('🔗 Auto-uploading image URL to Cloudinary:', href);
              
              uploadUrlToCloudinary(
                { 
                  url: href, 
                  options: { 
                    userId, 
                    imageType: 'post',
                    fileName: `auto-url-${Date.now()}`
                  } 
                },
                {
                  onSuccess: (response) => {
                    console.log('✅ Auto URL upload successful:', response.secure_url);
                    // Replace with Cloudinary URL
                    setTimeout(() => {
                      if (editor) {
                        const { from, to } = editor.state.selection;
                        editor.chain()
                          .deleteRange({ from, to })
                          .setImage({ src: response.secure_url })
                          .run();
                      }
                    }, 0);
                  },
                  onError: (error) => {
                    console.error('❌ Auto URL upload failed, using original URL:', error);
                    // Fallback to original URL
                    setTimeout(() => {
                      if (editor) {
                        const { from, to } = editor.state.selection;
                        editor.chain()
                          .deleteRange({ from, to })
                          .setImage({ src: href })
                          .run();
                      }
                    }, 0);
                  }
                }
              );
            } else {
              // Convert link to image directly if Cloudinary not configured
              setTimeout(() => {
                if (editor) {
                  const { from, to } = editor.state.selection;
                  editor.chain()
                    .deleteRange({ from, to })
                    .setImage({ src: href })
                    .run();
                }
              }, 0);
            }
            return false; // Don't create the link
          }
          
          return true;
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
        // Handle drag and drop for images
        allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded-lg bg-muted p-4 font-mono text-sm',
        },
      }),
      Color,
      TextStyle,
      CharacterCount.configure({
        limit: maxLength,
      }),
      SlashCommands,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
      // Handle paste events for image URLs and files
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        
        // Check for image files
        const imageFile = items.find(item => item.type.startsWith('image/'));
        if (imageFile) {
          const file = imageFile.getAsFile();
          if (file) {
            event.preventDefault();
            
            uploadToCloudinary(
              { 
                file, 
                options: { 
                  userId, 
                  imageType: 'post',
                  fileName: `pasted-image-${Date.now()}`
                } 
              },
              {
                onSuccess: (response) => {
                  editor?.chain().focus().setImage({ src: response.secure_url }).run();
                },
                onError: (error) => {
                  console.error('Failed to upload pasted image:', error);
                }
              }
            );
            return true;
          }
        }

        // Check for text that might be image URLs
        const text = event.clipboardData?.getData('text/plain');
        if (text && isImageUrl(text) && (text.startsWith('http://') || text.startsWith('https://'))) {
          event.preventDefault();
          
          // Check if Cloudinary is configured
          const isCloudinaryConfigured = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
          
          if (isCloudinaryConfigured) {
            console.log('🔗 Uploading pasted URL to Cloudinary:', text);
            
            uploadUrlToCloudinary(
              { 
                url: text, 
                options: { 
                  userId, 
                  imageType: 'post',
                  fileName: `pasted-url-${Date.now()}`
                } 
              },
              {
                onSuccess: (response) => {
                  console.log('✅ Pasted URL upload successful:', response.secure_url);
                  editor?.chain().focus().setImage({ src: response.secure_url }).run();
                },
                onError: (error) => {
                  console.error('❌ Pasted URL upload failed, using original URL:', error);
                  editor?.chain().focus().setImage({ src: text }).run();
                }
              }
            );
          } else {
            // Use URL directly if Cloudinary not configured
            editor?.chain().focus().setImage({ src: text }).run();
          }
          return true;
        }

        return false;
      },
      // Handle drop events for image files
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFile = files.find(file => file.type.startsWith('image/'));
        
        if (imageFile) {
          event.preventDefault();
          
          uploadToCloudinary(
            { 
              file: imageFile, 
              options: { 
                userId, 
                imageType: 'post',
                fileName: `dropped-image-${Date.now()}`
              } 
            },
            {
              onSuccess: (response) => {
                // Get the position where the file was dropped
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (pos) {
                  editor?.chain()
                    .focus()
                    .insertContentAt(pos.pos, {
                      type: 'image',
                      attrs: { src: response.secure_url }
                    })
                    .run();
                } else {
                  editor?.chain().focus().setImage({ src: response.secure_url }).run();
                }
              },
              onError: (error) => {
                console.error('Failed to upload dropped image:', error);
              }
            }
          );
          return true;
        }

        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const isNearLimit = characterCount > maxLength * 0.9;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className="border rounded-lg">
      <EditorToolbar editor={editor} />
      <div className="relative">
        <EditorContent editor={editor} />
        <div className={`absolute bottom-2 right-2 text-xs ${
          isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-muted-foreground'
        }`}>
          {characterCount}/{maxLength} characters
        </div>
      </div>
      
      {/* Drag and drop overlay hint */}
      <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200 bg-blue-50/80 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-600 font-medium" 
           id="drop-overlay">
        Drop images here to upload to Cloudinary
      </div>
    </div>
  );
};

export default TiptapEditor;