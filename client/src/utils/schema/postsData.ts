import { z } from "zod"

// Create post data schema
const createPostData = z.object({
  postTitle: z.string(),
    postDescription: z.string().optional(),
    postBannerImage: z.string().optional(),
    postTags: z.array(z.string()).default([]),
    published: z.boolean().default(false)
}) 

// Enhance post data schema
const enhancePostData = z.object({
  title: z.string().optional(),
  blog: z.string().optional()
})

// Bookmark post prop data schema
const bookmarkPostProp = z.object({
   postId: z.string().optional(),
  userId: z.string()
})
export type TEnhancePostData = z.infer<typeof enhancePostData>
export type TCreatePostData = z.infer<typeof createPostData>
export type TBookmarkPostProp = z.infer<typeof bookmarkPostProp>