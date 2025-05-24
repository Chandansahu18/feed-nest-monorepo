import express from "express";
import handleUserAuth from "../controllers/auth/handleUserAuth.controller";
import { handleUserEmailVerification } from "../controllers/auth/handleUserEmailVerification.controller";

const router = express.Router();

router.route("/v1/auth").post(handleUserAuth);
router.route("/v1/verify/:token").get(handleUserEmailVerification);



export default router;