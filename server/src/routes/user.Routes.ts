import express from "express";
import handleGetUser from "../controllers/user/handleGetUser.controller";
import handleGetUserSavedPosts from "../controllers/user/handleGetUserSavedPosts.controller";
import handleSearch from "../controllers/user/handleSearch.controller";
import handleUserSavedPost from "../controllers/user/handleUserSavedPost.controller";
import handleUserDetailsUpdate from "../controllers/user/handleUserDetailsUpdate.controller";
import handleUserAccountDelete from "../controllers/user/handleUserAccountDelete.controller";

const router = express.Router();

router.route("/v1/user").get(handleGetUser).patch(handleUserDetailsUpdate);
router.route("/v1/user/saved").get(handleGetUserSavedPosts).post(handleUserSavedPost);
router.route("/v1/search").get(handleSearch);
router.route("/v1/account/delete").delete(handleUserAccountDelete);


export default router;