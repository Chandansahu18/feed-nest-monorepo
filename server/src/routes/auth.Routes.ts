import express from 'express';
import handleUserAuth from '../controllers/auth/handleUserAuth.controller';
import { handleUserEmailVerification } from '../controllers/auth/handleUserEmailVerification.controller';
import { handleNewPassword, handleUserPasswordReset } from '../controllers/auth/handleUserPasswordReset.controller';
import { handleForgetPassword } from '../controllers/auth/handleForgetPassword.controller';

const router = express.Router();

router.route('/v1/auth').post(handleUserAuth);
router.route('/v1/verify/:token').get(handleUserEmailVerification);
router.route('/v1/forget-password').get(handleForgetPassword);
router.route('/v1/reset-password/:token').get(handleUserPasswordReset).post(handleNewPassword);

export default router;
