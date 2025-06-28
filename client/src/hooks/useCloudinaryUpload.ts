import { useMutation } from '@tanstack/react-query';
import { uploadToCloudinary } from '@/utils/cloudinary';

interface UploadOptions {
  userId: string;
  imageType: 'banner' | 'post';
  fileName?: string;
}

export const useCloudinaryUpload = () => {
  return useMutation({
    mutationFn: ({ file, options }: { file: File; options: UploadOptions }) =>
      uploadToCloudinary(file, options),
    onError: (error: Error) => {
      console.error('Upload mutation error:', error);
      
      // Log detailed error information for debugging
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

// Hook for getting current user ID (mock implementation)
export const useCurrentUser = () => {
  // TODO: Replace with actual user context/auth hook
  return {
    userId: 'user123', // This should come from your authentication system
    isAuthenticated: true,
  };
};