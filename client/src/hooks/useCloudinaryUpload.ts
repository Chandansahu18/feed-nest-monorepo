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
    onError: (error) => {
      console.error('Upload error:', error);
    },
  });
};