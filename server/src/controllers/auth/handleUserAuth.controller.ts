import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { compareHash, generateHash } from '../../utils/hash';
import { generateToken } from '../../utils/authTokens';
import { validateUserData } from '../../utils/schemaValidate';
import sendMail from '../../utils/email';
import { IUserCreatedDataResponse } from '@shared/types';

const prisma = new PrismaClient();
const baseURL = process.env.BASE_URL as string;
const nodeEnv = process.env.NODE_ENV as string;
const accessTokenExpiryTime = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY as string,
);
const refreshTokenExpiryTime = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY as string,
);

const setCookiesAndResponse = (
  res: Response<IUserCreatedDataResponse>,
  email: string,
  message: string,
  refreshToken?: string,
): void => {
  const accessToken = generateToken(email, accessTokenExpiryTime);
  const refreshTokenToUse =
    refreshToken || generateToken(email, refreshTokenExpiryTime);

  res
    .cookie('access_token', accessToken, {
      httpOnly: true,
      secure: nodeEnv === 'production' ? true : false,
      sameSite: nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: accessTokenExpiryTime,
    })
    .cookie('refresh_token', refreshTokenToUse, {
      httpOnly: true,
      secure: nodeEnv === 'production' ? true : false,
      sameSite: nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: refreshTokenExpiryTime,
    })
    .status(200)
    .json({
      success: true,
      message,
    });
};

const sendVerificationEmail = async (email: string): Promise<void> => {
  const accessToken = generateToken(email, accessTokenExpiryTime);
  await sendMail(email, 'sign up', 'Email verification link for signup', {
    redirectToEmailVerificationPageLink: `${baseURL}/v1/verify/${accessToken}`,
  });
};

const createUser = async (userData: {
  name: string;
  email: string;
  refreshToken?: string;
  userName?: string;
  hashedPassword?: string;
  isEmailVerified?: boolean;
}): Promise<void> => {
  await prisma.user.create({ data: userData });
};

const handleUserAuth = async (
  req: Request,
  res: Response<IUserCreatedDataResponse>,
): Promise<void> => {
  try {
    const { isAuthWithGoogle } = req.query;
    const validUserData = validateUserData.safeParse(req.body);

    if (!validUserData.success) {
      const errors = validUserData.error.issues;
      const errorMessage =
        errors.length === 1
          ? errors[0].message
          : errors.map((err) => err.message).join(' & ');
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const { email, name, userName, password } = validUserData.data;
    const existingUser = await prisma.user.findFirst({ where: { email } });

    // Handle Google Auth
    if (isAuthWithGoogle === 'true') {
      if (!existingUser) {
        // First-time Google sign-in
        const refreshToken = generateToken(email, refreshTokenExpiryTime);
        await createUser({
          name,
          email,
          isEmailVerified: true,
          refreshToken,
        });
        setCookiesAndResponse(res, email, 'User signed in successfully');
        return;
      } else {
        // Existing Google user
        const refreshToken = generateToken(email, refreshTokenExpiryTime);
        await prisma.user.update({
          where: { email },
          data: { refreshToken },
        });
        setCookiesAndResponse(
          res,
          email,
          'User signed in successfully',
          refreshToken,
        );
        return;
      }
    }

    // Handle Email/Password Auth
    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required',
      });
      return;
    }

    if (!existingUser) {
      // New user registration
      const hashedPassword = await generateHash(password);
      await createUser({
        name,
        email,
        userName,
        hashedPassword,
      });
      await sendVerificationEmail(email);
      res.status(200).json({
        success: true,
        message: 'Email verification link has been sent to your mail',
      });
      return;
    }

    if (!existingUser.isEmailVerified) {
      // Resend verification email for unverified users
      await sendVerificationEmail(email);
      res.status(200).json({
        success: true,
        message: 'Email verification link has been resent to your mail',
      });
      return;
    }

    if (!existingUser.hashedPassword) {
      // Google user adding password for first time
      const hashedPassword = await generateHash(password);
      await prisma.user.update({
        where: { email },
        data: { hashedPassword },
      });
      setCookiesAndResponse(res, email, 'User signed in successfully');
      return;
    }

    // Regular login with email/password
    const isPasswordValid = await compareHash(
      password,
      existingUser.hashedPassword,
    );
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Incorrect password',
      });
      return;
    }

    setCookiesAndResponse(res, email, 'User signed in successfully');
  } catch (error: unknown) {
    console.error('Authentication error:', error);
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

export default handleUserAuth;
