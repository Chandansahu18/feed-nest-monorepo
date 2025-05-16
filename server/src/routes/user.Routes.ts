import express from "express";
import handleUserAuth from "../controllers/user/handleUserAuth.controller";
import handleGetUser from "../controllers/user/handleGetUser.controller";
import handleGetUserPosts from "../controllers/user/handleGetUserPosts.controller";
import handleGetUserSavedPosts from "../controllers/user/handleGetUserSavedPosts.controller";
import handleSearch from "../controllers/user/handleSearch.controller";
import handleUserSavedPost from "../controllers/user/handleUserSavedPost.controller";
import handleUserDetailsUpdate from "../controllers/user/handleUserDetailsUpdate.controller";
import handleUserAccountDelete from "../controllers/user/handleUserAccountDelete.controller";

const router = express.Router();

router.route("/v1/user").get(handleGetUser).patch(handleUserDetailsUpdate)
router.route("/v1/user/posts").get(handleGetUserPosts);
router.route("/v1/user/posts/saved").get(handleGetUserSavedPosts).post(handleUserSavedPost);
router.route("/v1/search").get(handleSearch);
router.route("/v1/auth").post(handleUserAuth);
router.route("/v1/account/delete").delete(handleUserAccountDelete);


export default router;