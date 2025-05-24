import { Response, Request } from 'express';
import { PrismaClient } from '../../../generated/prisma/index';
import { generateToken } from '../../utils/authTokens';
import sendMail from '../../utils/email';
import { z } from 'zod';

const resetPasswordLinkExpiryTime = parseInt(
  process.env.RESET_PASSWORD_LINK_EXPIRY as string,
);
const baseURL = process.env.BASE_URL as string;

const isUserEmailValid = z.string().email('Invalid email address');
const prisma = new PrismaClient();

export const handleForgetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validateUserEmail = isUserEmailValid.safeParse(req.query.email);
    const email = validateUserEmail.data;

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email,
        isEmailVerified: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetPasswordToken = generateToken(
      email as string,
      resetPasswordLinkExpiryTime,
    );


    const redirectToResetPasswordPageLink = `${baseURL}/reset-password/${resetPasswordToken}`;
    const params = {
      redirectToResetPasswordPageLink,
    };


    await sendMail(
      email as string,
      'reset password',
      'Your Password Reset Request',
      params,
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal server error, please try again later';

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
