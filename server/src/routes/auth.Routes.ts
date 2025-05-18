import express from "express";
import handleUserAuth from "../controllers/auth/handleUserAuth.controller";

const router = express.Router();

router.route("/v1/auth").get(handleUserAuth)


export default router;