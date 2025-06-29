import type { TCloudinaryUploadOptions, TCloudinaryUploadResponse } from "./schema/cloudinary";

// Constants
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
const IMAGE_HOSTS = ['cloudinary', 'imgur', 'unsplash', 'pexels', 'pixabay'];
const SIZE_LIMITS = {
  banner: 5 * 1024 * 1024,
  post: 3 * 1024 * 1024,  
};

// Environment validation
const validateEnvironment = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing. Please check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
  }
  
  return { cloudName, uploadPreset };
};

// URL to File conversion
const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    
    if (!blob.type.startsWith('image/')) {
      throw new Error('URL does not point to a valid image file');
    }

    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to file:', error);
    throw new Error('Failed to load image from URL. Please check the URL and try again.');
  }
};

// Generate optimized public ID
const generatePublicId = (options: TCloudinaryUploadOptions): string => {
  const { userId, imageType, fileName } = options;
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);

  if (imageType === 'banner') {
    return `banners/${userId}/banner-${timestamp}`;
  } else {
    const imageName = fileName || `post-${timestamp}-${randomId}`;
    return `posts/${userId}/${imageName}`;
  }
};

// Handle Cloudinary API errors
const handleCloudinaryError = async (response: Response): Promise<never> => {
  let errorMessage = `Upload failed with status ${response.status}`;
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.error?.message || errorData.message || errorMessage;
  } catch {
    // If we can't parse the error response, use the default message
  }
  
  throw new Error(errorMessage);
};

// Main upload function
export const uploadToCloudinary = async (
  file: File,
  options: TCloudinaryUploadOptions
): Promise<TCloudinaryUploadResponse> => {
  // Validate environment
  const { cloudName, uploadPreset } = validateEnvironment();
  
  // Validate file
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const sizeLimit = SIZE_LIMITS[options.imageType];
  if (file.size > sizeLimit) {
    const sizeMB = (sizeLimit / 1024 / 1024).toFixed(1);
    throw new Error(`${options.imageType} images must be under ${sizeMB}MB`);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('public_id', generatePublicId(options));
  formData.append('resource_type', 'image');
  formData.append('tags', `user_${options.userId},${options.imageType}_image,feednest`);
  formData.append('context', `user_id=${options.userId}|image_type=${options.imageType}`);

  // Upload to Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return handleCloudinaryError(response);
    }

    const result: TCloudinaryUploadResponse = await response.json();
    
    console.log('✅ Upload successful:', {
      url: result.secure_url,
      publicId: result.public_id,
      size: `${(result.bytes / 1024).toFixed(1)}KB`,
      format: result.format
    });
    
    return result;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// URL upload function
export const uploadUrlToCloudinary = async (
  imageUrl: string,
  options: TCloudinaryUploadOptions
): Promise<TCloudinaryUploadResponse> => {
  // Validate URL format
  try {
    new URL(imageUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  // Check if it's likely an image URL
  if (!isImageUrl(imageUrl)) {
    console.warn('URL may not be an image, but proceeding with upload attempt');
  }

  console.log('🔗 Converting URL to file for Cloudinary upload:', imageUrl);

  // Generate filename from URL or use default
  const url = new URL(imageUrl);
  const urlPath = url.pathname;
  const urlFilename = urlPath.split('/').pop() || 'image';
  const filename = options.fileName || `url-${urlFilename}-${Date.now()}`;

  // Convert URL to File and upload
  try {
    const file = await urlToFile(imageUrl, filename);
    
    console.log('✅ URL converted to file:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)}KB`,
      type: file.type
    });

    return await uploadToCloudinary(file, options);
  } catch (error) {
    console.error('❌ URL to Cloudinary upload error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to upload image from URL to Cloudinary');
  }
};

// Utility functions
export const isImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    return IMAGE_EXTENSIONS.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext) || 
      urlObj.pathname.toLowerCase().endsWith(ext)
    ) || 
    IMAGE_HOSTS.some(host => urlObj.hostname.includes(host));
  } catch {
    return false;
  }
};

export const extractPublicIdFromUrl = (url: string): string => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
      return '';
    }

    const pathParts = parts.slice(uploadIndex + 2);
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExtension = fileName.split('.')[0];
    pathParts[pathParts.length - 1] = fileNameWithoutExtension;
    
    return pathParts.join('/');
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

export const getOptimizedImageUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const { cloudName } = validateEnvironment();
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  const transformations = [
    `q_${quality}`,
    `f_${format}`,
    ...(width ? [`w_${width}`] : []),
    ...(height ? [`h_${height}`] : [])
  ];
  
  const transformString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
};

// Batch upload function
export const batchUploadToCloudinary = async (
  files: File[],
  options: Omit<TCloudinaryUploadOptions, 'fileName'>
): Promise<TCloudinaryUploadResponse[]> => {
  if (files.length === 0) {
    throw new Error('No files provided for upload');
  }

  if (files.length > 10) {
    throw new Error('Maximum 10 files allowed per batch upload');
  }

  const uploadPromises = files.map((file, index) => 
    uploadToCloudinary(file, {
      ...options,
      fileName: `batch-${Date.now()}-${index}`
    })
  );

  try {
    const results = await Promise.all(uploadPromises);
    console.log(`✅ Batch upload successful: ${results.length} files uploaded`);
    return results;
  } catch (error) {
    console.error('❌ Batch upload failed:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  console.log('🗑️ Delete request for:', publicId);

  throw new Error('Delete functionality requires server-side implementation');
};