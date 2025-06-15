import express from "express";
import handleAvatarUpload from "../controllers/upload/handleAvatarUpload.controller";

const router = express.Router();

router.route("/v1/upload").post(handleAvatarUpload);

export default router;