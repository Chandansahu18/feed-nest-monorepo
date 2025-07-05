import { useMutation } from "@tanstack/react-query";
import { uploadToCloudinary, uploadUrlToCloudinary } from "@/utils/cloudinary";
import type {
  TCloudinaryUploadOptions,
  TUploadError,
  TUploadResult,
} from "@/utils/schema/cloudinary";
import { useUserData } from "./useUserData";
import { useState } from "react";

const validateCloudinaryConfig = (): boolean => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  return !!(cloudName && uploadPreset);
};

export const useCloudinaryUpload = () => {
  return useMutation<
    TUploadResult,
    TUploadError,
    { file: File; options: TCloudinaryUploadOptions }
  >({
    mutationFn: async ({ file, options }) => {
      if (!validateCloudinaryConfig()) {
        throw new Error(
          "Cloudinary configuration missing. Please check your environment variables."
        );
      }

      const response = await uploadToCloudinary(file, options);

      return {
        url: response.secure_url,
        publicId: response.public_id,
        originalFilename: response.original_filename,
      };
    },
    onError: (error) => {
      console.error("File upload failed:", error.message);
    },
  });
};

export const useCloudinaryUrlUpload = () => {
  return useMutation<
    TUploadResult,
    TUploadError,
    { url: string; options: TCloudinaryUploadOptions }
  >({
    mutationFn: async ({ url, options }) => {
      if (!validateCloudinaryConfig()) {
        throw new Error(
          "Cloudinary configuration missing. Please check your environment variables."
        );
      }

      const response = await uploadUrlToCloudinary(url, options);

      return {
        url: response.secure_url,
        publicId: response.public_id,
        originalFilename: response.original_filename,
      };
    },
    onError: (error) => {
      console.error("URL upload failed:", error.message);
    },
  });
};

export const useCloudinaryBatchUpload = () => {
  return useMutation<
    TUploadResult[],
    TUploadError,
    { files: File[]; options: Omit<TCloudinaryUploadOptions, "fileName"> }
  >({
    mutationFn: async ({ files, options }) => {
      if (!validateCloudinaryConfig()) {
        throw new Error(
          "Cloudinary configuration missing. Please check your environment variables."
        );
      }

      const uploadPromises = files.map((file, index) =>
        uploadToCloudinary(file, {
          ...options,
          fileName: `batch-${Date.now()}-${index}`,
        })
      );

      const responses = await Promise.all(uploadPromises);

      return responses.map((response) => ({
        url: response.secure_url,
        publicId: response.public_id,
        originalFilename: response.original_filename,
      }));
    },
    onError: (error) => {
      console.error("Batch upload failed:", error.message);
    },
  });
};

export const useCurrentUser = () => {
  const { data: userData, error, isPending } = useUserData();

  return {
    userId: userData?.data?.id || "anonymous",
    userName: userData?.data?.userName || null,
    isAuthenticated: !!userData?.data,
    isLoading: isPending,
    error: error?.message || null,
  };
};

export const useBannerImageUpload = () => {
  const { userId } = useCurrentUser();
  const fileUpload = useCloudinaryUpload();
  const urlUpload = useCloudinaryUrlUpload();

  const uploadFile = (file: File, fileName?: string) => {
    return fileUpload.mutateAsync({
      file,
      options: {
        userId,
        imageType: "banner",
        fileName: fileName || `banner-${Date.now()}`,
      },
    });
  };

  const uploadUrl = (url: string, fileName?: string) => {
    return urlUpload.mutateAsync({
      url,
      options: {
        userId,
        imageType: "banner",
        fileName: fileName || `banner-url-${Date.now()}`,
      },
    });
  };

  return {
    uploadFile,
    uploadUrl,
    isUploading: fileUpload.isPending || urlUpload.isPending,
    error: fileUpload.error || urlUpload.error,
  };
};

export const usePostImageUpload = () => {
  const { userId } = useCurrentUser();
  const fileUpload = useCloudinaryUpload();
  const urlUpload = useCloudinaryUrlUpload();

  const uploadFile = (file: File, fileName?: string) => {
    return fileUpload.mutateAsync({
      file,
      options: {
        userId,
        imageType: "post",
        fileName: fileName || `post-${Date.now()}`,
      },
    });
  };

  const uploadUrl = (url: string, fileName?: string) => {
    return urlUpload.mutateAsync({
      url,
      options: {
        userId,
        imageType: "post",
        fileName: fileName || `post-url-${Date.now()}`,
      },
    });
  };

  return {
    uploadFile,
    uploadUrl,
    isUploading: fileUpload.isPending || urlUpload.isPending,
    error: fileUpload.error || urlUpload.error,
  };
};

export const useImageUrlManager = () => {
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [postImageUrls, setPostImageUrls] = useState<string[]>([]);

  const addBannerImage = (url: string) => {
    setBannerImageUrl(url);
  };

  const removeBannerImage = () => {
    setBannerImageUrl("");
  };

  const addPostImage = (url: string) => {
    setPostImageUrls((prev) => [...prev, url]);
  };

  const removePostImage = (url: string) => {
    setPostImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url));
  };

  const clearAllImages = () => {
    setBannerImageUrl("");
    setPostImageUrls([]);
  };

  const getImageDataForDB = () => ({
    bannerImage: bannerImageUrl || null,
    postImages: postImageUrls.length > 0 ? postImageUrls : [],
    hasImages: !!(bannerImageUrl || postImageUrls.length > 0),
  });

  return {
    bannerImageUrl,
    postImageUrls,
    addBannerImage,
    removeBannerImage,
    addPostImage,
    removePostImage,
    clearAllImages,
    getImageDataForDB,
  };
};

export const useImageValidation = () => {
  const validateFile = (file: File, imageType: "banner" | "post" = "post") => {
    const errors: string[] = [];

    if (!file.type.startsWith("image/")) {
      errors.push("File must be an image");
    }

    const maxSizes = {
      banner: 5 * 1024 * 1024,
      post: 3 * 1024 * 1024,
    };

    if (file.size > maxSizes[imageType]) {
      errors.push(
        `File size must be less than ${maxSizes[imageType] / 1024 / 1024}MB`
      );
    }

    if (file.name.length > 100) {
      errors.push("File name is too long");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const validateUrl = (url: string) => {
    const errors: string[] = [];

    try {
      new URL(url);
    } catch {
      errors.push("Invalid URL format");
    }

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const hasImageExtension = imageExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    if (!hasImageExtension) {
      errors.push("URL does not appear to be an image");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    validateFile,
    validateUrl,
  };
};
