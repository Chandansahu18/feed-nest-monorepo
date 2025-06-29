import { useMutation } from '@tanstack/react-query';
import { uploadToCloudinary, uploadUrlToCloudinary } from '@/utils/cloudinary';
import type { TCloudinaryUploadOptions } from '@/utils/schema/cloudinary';


export const useCloudinaryUpload = () => {
  return useMutation({
    mutationFn: ({ file, options }: { file: File; options: TCloudinaryUploadOptions }) =>
      uploadToCloudinary(file, options),
    onError: (error: Error) => {
      console.error('Upload mutation error:', error);
      if (error.message.includes('VITE_CLOUDINARY')) {
        console.error('❌ Cloudinary configuration error. Please check your .env file.');
        console.error('Required variables:');
        console.error('- VITE_CLOUDINARY_CLOUD_NAME');
        console.error('- VITE_CLOUDINARY_UPLOAD_PRESET');
      }
    },
    onSuccess: (data) => {
      console.log('✅ Upload successful:', data.secure_url);
    },
  });
};

// New hook for URL uploads
export const useCloudinaryUrlUpload = () => {
  return useMutation({
    mutationFn: ({ url, options }: { url: string; options: TCloudinaryUploadOptions }) =>
      uploadUrlToCloudinary(url, options),
    onError: (error: Error) => {
      console.error('URL upload mutation error:', error);
      
      if (error.message.includes('VITE_CLOUDINARY')) {
        console.error('❌ Cloudinary configuration error. Please check your .env file.');
        console.error('Required variables:');
        console.error('- VITE_CLOUDINARY_CLOUD_NAME');
        console.error('- VITE_CLOUDINARY_UPLOAD_PRESET');
      }
    },
    onSuccess: (data) => {
      console.log('✅ URL upload successful:', data.secure_url);
    },
  });
};

export const useCurrentUser = () => {
  // TODO: Replace with actual user context/auth hook
  return {
    userId: 'user123', // This should come from your authentication system
    isAuthenticated: true,
  };
};