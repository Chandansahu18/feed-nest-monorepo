import { z } from "zod";
// Cloudinary upload response schema
const cloudinaryUploadResponse = z.object({
  secure_url: z.string(),
  public_id: z.string(),
  version: z.number(),
  signature: z.string(),
  width: z.number(),
  height: z.number(),
  format: z.string(),
  resource_type: z.string(),
  created_at: z.string(),
  tags: z.array(z.string()),
  bytes: z.number(),
  type: z.string(),
  etag: z.string(),
  placeholder: z.boolean(),
  url: z.string(),
  original_filename: z.string()
})

const uploadOptions = z.object({
  userId: z.string(),
  imageType: z.enum(['banner', 'post']),
  fileName: z.string().optional()
})


export type TCloudinaryUploadResponse = z.infer<typeof cloudinaryUploadResponse>
export type TCloudinaryUploadOptions = z.infer<typeof uploadOptions>