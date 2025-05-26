import express from "express";
import handleGetPost from "../controllers/post/handleGetPost.controller";
import handleGetAllPosts from "../controllers/post/handleGetAllPosts.controller";
import handleCreateNewPost from "../controllers/post/handleCreateNewPost.controller";
import handlePostDetailsUpdate from "../controllers/post/handlePostDetailsUpdate.controller";
import handleComment from "../controllers/post/handleComment.controller";
import handleCommentUpdate from "../controllers/post/handleCommentUpdate.controller";
import handleDeletePost from "../controllers/post/handleDeletePost.controller";
import handleDeleteComment from "../controllers/post/handleDeleteComment.controller";
import { handleEnhancePost } from "../controllers/post/handleEnhancePost.controller";
import { handlePostPrivacy } from "../controllers/post/handlePostPrivacy.controller";

const router = express.Router();

router.route("/v1/posts").get(handleGetAllPosts);
router.route("/v1/post/publish").get(handlePostPrivacy);
router.route("/v1/post").get(handleGetPost).post(handleCreateNewPost).patch(handlePostDetailsUpdate).delete(handleDeletePost);
router.route("/v1/enhance").patch(handleEnhancePost);
router.route("/v1/comment").post(handleComment).patch(handleCommentUpdate).delete(handleDeleteComment);

export default router;