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
) => {
  const accessToken = generateToken(email, accessTokenExpiryTime);
  const refreshToken = generateToken(email, refreshTokenExpiryTime);
  res
    .cookie('access_token', accessToken, {
      httpOnly: true,
      secure: nodeEnv === 'production' ? true : false,
      sameSite: nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: accessTokenExpiryTime,
    })
    .cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: nodeEnv === 'production' ? true : false,
      sameSite: nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: refreshTokenExpiryTime,
    })
    .status(204)
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
  userName?: string;
  hashedPassword?: string;
  isEmailVerified?: boolean;
}) => {
  return prisma.user.create({ data: userData });
};

const handleUserAuth = async (
  req: Request,
  res: Response<IUserCreatedDataResponse>,
): Promise<void> => {
  try {
    const { isAuthWithGoogle } = req.query;
    const validUserData = validateUserData.safeParse(req.body);
    if (!validUserData.data) {
      const errors = validUserData.error?.issues;
      const errorMessage =
        errors.length === 1
          ? errors[0].message
          : errors.map((err) => err.message).join(' & ');
      throw new Error(errorMessage);
    }
    const { email, name, userName, password } = validUserData.data;
    const doUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // User Auth with Google first time
    if (!doUserExist && isAuthWithGoogle === 'true') {
      await createUser({ name, email, isEmailVerified: true });
      setCookiesAndResponse(res, email, 'user signed in successfully');
    } else if (!doUserExist || !doUserExist.isEmailVerified) {
      const hashedPassword = await generateHash(password as string);
      if (!doUserExist) {
        await createUser({ name, email, userName, hashedPassword });
      }
      await sendVerificationEmail(email);
      res.status(200).json({
        success: true,
        message: 'Email verification link has been sent to your mail',
      });
    } else {
      // Google authenticated user setting password for first time email sign in.
      if (!doUserExist.hashedPassword) {
        const hashedPassword = await generateHash(password as string);
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            hashedPassword,
          },
        });
        setCookiesAndResponse(res, email, 'User signed in successfully');
      } else {
        if (isAuthWithGoogle === 'true') {
          setCookiesAndResponse(res, email, 'User signed in successfully');
        } else {
          const isPasswordValid = await compareHash(
            password as string,
            doUserExist.hashedPassword,
          );

          if (!isPasswordValid) {
            res.status(400).json({
              success: false,
              message: 'Incorrect password',
            });
          } else {
            setCookiesAndResponse(res, email, 'User signed in successfully');
          }
        }
      }
    }
  } catch (error: unknown) {
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