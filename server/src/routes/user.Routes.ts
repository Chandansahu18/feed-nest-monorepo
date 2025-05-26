import express from "express";
import handleGetUser from "../controllers/user/handleGetUser.controller";
import handleGetUserSavedPosts from "../controllers/user/handleGetUserSavedPosts.controller";
import handleSearch from "../controllers/user/handleSearch.controller";
import handleUserDetailsUpdate from "../controllers/user/handleUserDetailsUpdate.controller";
import handleUserAccountDelete from "../controllers/user/handleUserAccountDelete.controller";
import handleUserPostSave from "../controllers/user/handleUserPostSave.controller";

const router = express.Router();

router.route("/v1/user").get(handleGetUser).patch(handleUserDetailsUpdate).delete(handleUserAccountDelete);
router.route("/v1/user/saved").get(handleGetUserSavedPosts).post(handleUserPostSave);
router.route("/v1/search").get(handleSearch);

export default router;