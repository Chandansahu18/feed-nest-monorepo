import axios from "axios";
import type {
  TCloudinaryUploadOptions,
  TCloudinaryUploadResponse,
} from "./schema/cloudinary";

// Constants
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".tiff",
];
const SIZE_LIMITS = {
  banner: 5 * 1024 * 1024,
  post: 3 * 1024 * 1024,
  avatar: 3 * 1024 * 1024,
};

const validateEnvironment = () => {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  return { uploadPreset };
};

const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      throw new Error("URL does not point to a valid image file");
    }

    return new File([blob], filename, { type: blob.type });
  } catch {
    throw new Error(
      "Failed to load image from URL. Please check the URL and try again."
    );
  }
};

const generatePublicId = (options: TCloudinaryUploadOptions): string => {
  const { userId, imageType, fileName } = options;
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);

  if (imageType === "banner") {
    return `banners/${userId}/banner-${timestamp}`;
  } else if (imageType === "avatar") {
    return `avatar/${userId}/${timestamp}`;
  } else{
    const imageName = fileName || `post-${timestamp}-${randomId}`;
    return `posts/${userId}/${imageName}`;
  }
};

const handleCloudinaryError = async (response: Response): Promise<never> => {
  let errorMessage = `Upload failed with status ${response.status}`;

  try {
    const errorData = await response.json();
    errorMessage =
      errorData.error?.message || errorData.message || errorMessage;
  } finally {
    throw new Error(errorMessage);
  }
};

export const uploadToCloudinary = async (
  file: File,
  options: TCloudinaryUploadOptions
): Promise<TCloudinaryUploadResponse> => {
  const { uploadPreset } = validateEnvironment();

  if (!file?.type?.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const sizeLimit = SIZE_LIMITS[options.imageType];
  if (file.size > sizeLimit) {
    const sizeMB = (sizeLimit / 1024 / 1024).toFixed(1);
    throw new Error(`${options.imageType} images must be under ${sizeMB}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("public_id", generatePublicId(options));
  formData.append("resource_type", "image");
  formData.append(
    "tags",
    `user_${options.userId},${options.imageType}_image,feednest`
  );
  formData.append(
    "context",
    `user_id=${options.userId}|image_type=${options.imageType}`
  );

  const uploadUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  try {
    const response = await axios.post<TCloudinaryUploadResponse>(
      uploadUrl,
      formData
    );
    console.log(response.data.secure_url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return handleCloudinaryError(error.response?.data);
    }
    throw error;
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
    throw new Error("Invalid URL format");
  }

  if (!isImageUrl(imageUrl)) {
    console.warn("URL may not be an image, but proceeding with upload attempt");
  }

  // Generate filename from URL or use default
  const url = new URL(imageUrl);
  const urlPath = url.pathname;
  const urlFilename = urlPath.split("/").pop() || "image";
  const filename = options.fileName || `url-${urlFilename}-${Date.now()}`;

  try {
    const file = await urlToFile(imageUrl, filename);
    return await uploadToCloudinary(file, options);
  } catch {
    throw new Error("Failed to upload image from URL to Cloudinary");
  }
};

// Utility functions
export const isImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);

    return IMAGE_EXTENSIONS.some(
      (ext) =>
        urlObj.pathname.toLowerCase().includes(ext) ||
        urlObj.pathname.toLowerCase().endsWith(ext)
    );
  } catch {
    return false;
  }
};

export const extractPublicIdFromUrl = (url: string): string => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
      return "";
    }

    const pathParts = parts.slice(uploadIndex + 2);
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExtension = fileName.split(".")[0];
    pathParts[pathParts.length - 1] = fileNameWithoutExtension;

    return pathParts.join("/");
  } catch {
    throw new Error("Error extracting public ID");
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
  const { width, height, quality = "auto", format = "auto" } = options;

  const transformations = [
    `q_${quality}`,
    `f_${format}`,
    ...(width ? [`w_${width}`] : []),
    ...(height ? [`h_${height}`] : []),
  ];

  const transformString = transformations.join(",");

  return `${
    import.meta.env.VITE_CLOUDINARY_OPTIMIZED_IMAGE_URL
  }/${transformString}/${publicId}`;
};

// Batch upload function
export const batchUploadToCloudinary = async (
  files: File[],
  options: Omit<TCloudinaryUploadOptions, "fileName">
): Promise<TCloudinaryUploadResponse[]> => {
  if (files.length === 0) {
    throw new Error("No files provided for upload");
  }

  if (files.length > 10) {
    throw new Error("Maximum 10 files allowed per batch upload");
  }

  const uploadPromises = files.map((file, index) =>
    uploadToCloudinary(file, {
      ...options,
      fileName: `batch-${Date.now()}-${index}`,
    })
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};
