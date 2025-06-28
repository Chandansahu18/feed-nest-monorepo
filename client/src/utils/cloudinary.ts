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

interface UploadOptions {
  userId: string;
  imageType: 'banner' | 'post';
  fileName?: string;
}

export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions
): Promise<CloudinaryUploadResponse> => {
  const { userId, imageType, fileName } = options;
  
  // Generate file name based on type
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop() || 'png';
  
  let publicId: string;
  if (imageType === 'banner') {
    publicId = `postImageFiles/${userId}/postBannerImage/banner-image`;
  } else {
    const imageName = fileName || `image${timestamp}`;
    publicId = `postImageFiles/${userId}/${imageName}`;
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('public_id', publicId);
  formData.append('overwrite', 'true'); // Overwrite if same name exists
  formData.append('resource_type', 'image');
  
  // Add folder structure
  formData.append('folder', `postImageFiles/${userId}${imageType === 'banner' ? '/postBannerImage' : ''}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result: CloudinaryUploadResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Note: Deletion requires server-side implementation with API secret
    // This is a placeholder for the delete functionality
    console.log('Delete request for:', publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Utility function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string => {
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
};