interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  original_filename: string;
}

interface CloudinaryError {
  error: {
    message: string;
    http_code: number;
  };
}

interface UploadOptions {
  userId: string;
  imageType: 'banner' | 'post';
  fileName?: string;
}

// Validate environment variables
const validateCloudinaryConfig = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not configured. Please add it to your .env file.');
  }

  if (!uploadPreset) {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not configured. Please add it to your .env file.');
  }

  return { cloudName, uploadPreset };
};

export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions
): Promise<CloudinaryUploadResponse> => {
  try {
    // Validate configuration first
    const { cloudName, uploadPreset } = validateCloudinaryConfig();
    
    const { userId, imageType, fileName } = options;
    
    // Validate file
    if (!file) {
      throw new Error('No file provided for upload');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Generate unique timestamp for file naming
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    
    let publicId: string;
    
    if (imageType === 'banner') {
      // For banner images: postImages/postBannerImages/userId/banner-image-timestamp
      publicId = `postImages/postBannerImages/${userId}/banner-image-${timestamp}`;
    } else {
      // For post images: postImages/userId/post-image-timestamp
      const imageName = fileName ? `${fileName}-${timestamp}` : `post-image-${timestamp}-${randomId}`;
      publicId = `postImages/${userId}/${imageName}`;
    }

    console.log('Upload configuration:', {
      cloudName,
      uploadPreset,
      publicId,
      fileSize: file.size,
      fileType: file.type,
      imageType
    });

    // Create form data - REMOVED overwrite parameter for unsigned upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('public_id', publicId);
    formData.append('resource_type', 'image');
    
    // Optional: Add tags for better organization
    formData.append('tags', `user_${userId},${imageType}_image,feednest`);

    // Optional: Add context metadata
    formData.append('context', `user_id=${userId}|image_type=${imageType}`);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    console.log('Uploading to:', uploadUrl);
    console.log('Public ID:', publicId);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with status:', response.status);
      console.error('Error response:', errorText);
      
      try {
        const errorJson: CloudinaryError = JSON.parse(errorText);
        throw new Error(`Upload failed: ${errorJson.error.message}`);
      } catch (parseError) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}. ${errorText}`);
      }
    }

    const result: CloudinaryUploadResponse = await response.json();
    console.log('✅ Upload successful:', result.secure_url);
    console.log('📁 Stored at:', result.public_id);
    
    return result;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Note: Deletion requires server-side implementation with API secret
    // This is a placeholder for the delete functionality
    console.log('Delete request for:', publicId);
    // You would need to implement this on your backend
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Utility function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      const pathParts = parts.slice(uploadIndex + 2);
      const fileName = pathParts[pathParts.length - 1];
      const fileNameWithoutExtension = fileName.split('.')[0];
      pathParts[pathParts.length - 1] = fileNameWithoutExtension;
      return pathParts.join('/');
    }
    return '';
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

// Utility function to generate optimized Cloudinary URLs
export const getOptimizedImageUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const { cloudName } = validateCloudinaryConfig();
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transformations = [`q_${quality}`, `f_${format}`];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  
  const transformString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
};