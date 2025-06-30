import { z } from "zod";

// Cloudinary upload response schema
const cloudinaryUploadResponse = z.object({
  secure_url: z.string().url(),
  public_id: z.string(),
  version: z.number(),
  signature: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  format: z.string(),
  resource_type: z.literal('image'),
  created_at: z.string(),
  tags: z.array(z.string()).default([]),
  bytes: z.number().positive(),
  type: z.string(),
  etag: z.string(),
  placeholder: z.boolean().default(false),
  url: z.string().url(),
  original_filename: z.string()
});

// Upload options schema
const uploadOptions = z.object({
  userId: z.string().min(1, 'User ID is required'),
  imageType: z.enum(['banner', 'post'], {
    errorMap: () => ({ message: 'Image type must be either "banner" or "post"' })
  }),
  fileName: z.string().optional()
});
// Error response schema
const cloudinaryError = z.object({
  error: z.object({
    message: z.string(),
    http_code: z.number().optional()
  })
});

// Upload result schema for frontend use
const uploadResult = z.object({
  url: z.string().url(),
  publicId: z.string(),
  originalFilename: z.string().optional()
});

const uploadError = z.object({
  message: z.string(),
  code: z.string().optional()
})

// Batch upload result schema
const batchUploadResult = z.array(uploadResult);


// Image validation schema
const imageValidation = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string())
});

// Image data for database storage
const imageDataForDB = z.object({
  bannerImage: z.string().url().nullable(),
  postImages: z.array(z.string().url()).default([]),
  hasImages: z.boolean()
});

// Export types
export type TCloudinaryUploadResponse = z.infer<typeof cloudinaryUploadResponse>;
export type TCloudinaryUploadOptions = z.infer<typeof uploadOptions>;
export type TCloudinaryError = z.infer<typeof cloudinaryError>;
export type TUploadResult = z.infer<typeof uploadResult>;
export type TUploadError = z.infer<typeof uploadError>;
export type TBatchUploadResult = z.infer<typeof batchUploadResult>;
export type TImageValidation = z.infer<typeof imageValidation>;
export type TImageDataForDB = z.infer<typeof imageDataForDB>;
  

