export interface IGenericMessageResponse {
  success: boolean;
  message: string;
}

// Post Like Data Types
export interface IPostLikes {
  id: string;
  postId: string;
  userId: string;
}

// User Data Response Types
export interface IUser {
  id: string;
  email: string;
  name: string;
  userName: string | null;
  avatar: string | null;
  profileBanner: string | null;
  bio: string | null;
  location: string | null;
  linkedInHandle: string | null;
  twitterHandle: string | null;
  githubHandle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreatedDataResponse {
  success: boolean;
  message: string;
  data?: IUser;
}

export interface IUserData extends IUser {
  posts: IPost[];
  postComments: IPostCommentOrReply[];
  postLikes: IPostLikes[];
  followingRelations: IFollowingRelations[];
}

export interface IUserDataResponse {
  success: boolean;
  message: string;
  data?: IUserData | null;
}

// Post Data Response Types
export interface IPost {
  id: string;
  postTitle: string;
  postDescription: string | null;
  postBannerImage: string | null;
  postTags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
}

export interface IPostCreatedDataResponse {
  success: boolean;
  message: string;
  data?: IPost | null;
}

export interface IPostData extends IPost {
  creator: IUser;
  postComments: IPostCommentOrReply[];
  postLikes: IPostLikes[];
}

export interface IPostDataResponse {
  success: boolean;
  message: string;
  data?: IPostData | null;
}

export interface IEnhancedPostDataResponse {
  success: boolean;
  message: string;
  data?: string | null;
}

export interface IAllPosts extends IPost {
  creator: IUser;
}

export interface IPostsDataResponse {
  success: boolean;
  message: string;
  data?: IAllPosts[] | null;
}

export interface IPostPrivacyStatusDataResponse {
  success: boolean;
  message: string;
  data?: IPost | null;
}
// Post Comment Or Reply Data Response types
export interface IPostCommentOrReply {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  comment: string;
  postId: string | null;
  userId: string;
  commentId: string | null;
}

export interface IPostCommentOrReplyDataResponse {
  success: boolean;
  message: string;
  data?: IPostCommentOrReply | null;
}

export interface IAllPostCommentsOrReplies extends IPostCommentOrReply {
  post?: IPost | null;
}

export interface IAllPostCommentsOrRepliesDataResponse {
  success: boolean;
  message: string;
  data?: IAllPostCommentsOrReplies[] | null;
}

// Following Relation Data Response Types
export interface IFollowingRelations {
  id: string;
  userId: string;
  followingUserId: string;
}
export interface IFollowingRelationsDataResponse {
  success: boolean;
  message: string;
  data?: IFollowingRelations[] | null;
}

// User Saved Posts Data Response Types
export interface ISavedPost {
  id: string;
  postId: string;
  userId: string;
}

export interface ISavedPostData extends ISavedPost {
  post: IPost;
}
export interface ISavedPostsDataResponse {
  success: boolean;
  message: string;
  data?: ISavedPostData[] | ISavedPostData | null;
}

// Search Data Response Types
export interface ISearchData extends IPost {
  creator: IUser;
  postComments: IPostCommentOrReply[];
  postLikes: IPostLikes[];
}

export interface ISearchDataResponse {
  success: boolean;
  message: string;
  data?: ISearchData[] | null;
}