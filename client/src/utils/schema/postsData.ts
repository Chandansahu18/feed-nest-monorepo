import { z } from "zod";

// Create post data schema
const createPostData = z.object({
  postTitle: z.string(),
  postDescription: z.string().optional(),
  postBannerImage: z.string().optional(),
  postTags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

// Enhance post data schema
const enhancePostData = z.object({
  title: z.string().optional(),
  blog: z.string().optional(),
});

// Update post data schema
const updatePostData = z.object({
  postTitle: z.string().optional(),
  postDescription: z.string().optional(),
  postBannerImage: z.string().optional(),
  postTags: z.array(z.string()).optional(),
  published: z.boolean().default(false).optional(),
});

// Bookmark post prop data schema
const bookmarkPostProp = z.object({
  postId: z.string().optional(),
  userId: z.string(),
});

// Post delete prop data schema
const deletePostProp = z.object({
  ids: z.array(z.string())
});

// Post comment prop data schema
const postCommentProp = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  comment: z.string()
});


export type TEnhancePostData = z.infer<typeof enhancePostData>;
export type TCreatePostData = z.infer<typeof createPostData>;
export type TBookmarkPostProp = z.infer<typeof bookmarkPostProp>;
export type TPostDataUpdate = z.infer<typeof updatePostData>;
export type TPostDelete = z.infer<typeof deletePostProp>;
export type TPostComment = z.infer<typeof postCommentProp>