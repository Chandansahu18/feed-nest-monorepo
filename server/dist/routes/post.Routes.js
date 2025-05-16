"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleGetPost_controller_1 = __importDefault(require("../controllers/post/handleGetPost.controller"));
const handleGetAllPosts_controller_1 = __importDefault(require("../controllers/post/handleGetAllPosts.controller"));
const handleCreateNewPost_controller_1 = __importDefault(require("../controllers/post/handleCreateNewPost.controller"));
const handlePostDetailsUpdate_controller_1 = __importDefault(require("../controllers/post/handlePostDetailsUpdate.controller"));
const handleComment_controller_1 = __importDefault(require("../controllers/post/handleComment.controller"));
const handleCommentUpdate_controller_1 = __importDefault(require("../controllers/post/handleCommentUpdate.controller"));
const handleDeletePost_controller_1 = __importDefault(require("../controllers/post/handleDeletePost.controller"));
const handleDeleteComment_controller_1 = __importDefault(require("../controllers/post/handleDeleteComment.controller"));
const router = express_1.default.Router();
router.route("/v1/all-posts").get(handleGetAllPosts_controller_1.default);
router.route("/v1/post").get(handleGetPost_controller_1.default).post(handleCreateNewPost_controller_1.default).patch(handlePostDetailsUpdate_controller_1.default).delete(handleDeletePost_controller_1.default);
router.route("/v1/comment").post(handleComment_controller_1.default).patch(handleCommentUpdate_controller_1.default).delete(handleDeleteComment_controller_1.default);
exports.default = router;
