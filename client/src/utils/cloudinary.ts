import { CLOUDINARY_API } from "./apiClient";
import type { TCloudinaryUploadOptions, TCloudinaryUploadResponse } from "./schema/cloudinary";

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const IMAGE_HOSTS = ['cloudinary', 'imgur', 'unsplash'];
const SIZE_LIMITS = {
  banner: 2 * 1024 * 1024, 
  post: 1 * 1024 * 1024    
};

const urlToFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('URL does not point to a valid image');

  return new File([blob], filename, { type: blob.type });
};

const generatePublicId = (options: TCloudinaryUploadOptions): string => {
  const { userId, imageType, fileName } = options;
  const timestamp = Date.now();

  return imageType === 'banner'
    ? `banners/${userId}/banner-${timestamp}`  
    : `posts/${userId}/${fileName || `post-${timestamp}`}`; 
};

const handleCloudinaryError = async (response: Response) => {
  const error = await response.json();
  throw new Error(error.message || `Upload failed with status ${response.status}`);
};

export const uploadToCloudinary = async (
  file: File,
  options: TCloudinaryUploadOptions
): Promise<TCloudinaryUploadResponse> => {

  if (!file?.type?.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const sizeLimit = SIZE_LIMITS[options.imageType];
  if (file.size > sizeLimit) {
    throw new Error(
      `${options.imageType} images must be under ${sizeLimit / 1024 / 1024}MB`
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('public_id', generatePublicId(options));
  formData.append('tags', `user_${options.userId},${options.imageType}`);

  const response = await fetch(
    import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
    { method: 'POST', body: formData }
  );

  if (!response.ok) return handleCloudinaryError(response);
  return response.json();
};

export const uploadUrlToCloudinary = async (
  imageUrl: string,
  options: TCloudinaryUploadOptions
): Promise<TCloudinaryUploadResponse> => {
  try { new URL(imageUrl) } 
  catch { throw new Error('Invalid image URL'); }

  const url = new URL(imageUrl);
  const filename = options.fileName || 
    `url-${url.pathname.split('/').pop() || 'image'}-${Date.now()}`;

  const file = await urlToFile(imageUrl, filename);
  return uploadToCloudinary(file, options);
};

export const getOptimizedImageUrl = (
  publicId: string, 
  options: { 
    width?: number; 
    height?: number; 
    quality?: string; 
    format?: string 
  } = {}
): string => {
  const transforms = [
    `q_${options.quality || 'auto'}`,
    `f_${options.format || 'auto'}`,
    ...(options.width ? [`w_${options.width}`] : []),
    ...(options.height ? [`h_${options.height}`] : [])
  ];

  return `${CLOUDINARY_API}/${transforms.join(',')}/${publicId}`;
};

export const isImageUrl = (url: string): boolean => {
  try {
    const { pathname, hostname } = new URL(url);
    return IMAGE_EXTENSIONS.some(ext => pathname.toLowerCase().includes(ext)) ||
           IMAGE_HOSTS.some(host => hostname.includes(host));
  } catch {
    return false;
  }
};

export const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return '';

  const pathParts = parts.slice(uploadIndex + 2);
  const fileName = pathParts[pathParts.length - 1].split('.')[0];
  pathParts[pathParts.length - 1] = fileName;
  
  return pathParts.join('/');
};