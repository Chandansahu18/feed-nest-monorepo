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

const handleUserAuth = async (req: Request, res: Response<IUserCreatedDataResponse>): Promise<void> => {
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

    // If user gets authenticated using google for the first time
    if (!doUserExist && isAuthWithGoogle === 'true') {
      await prisma.user.create({
        data: {
          name,
          email,
          isEmailVerified: true,
        },
      });
      setCookiesAndResponse(res, email, 'user signed in successfully');
    } else if (!doUserExist || !doUserExist.isEmailVerified) {
      const accessToken = generateToken(email, accessTokenExpiryTime);
      const hashedPassword = await generateHash(password as string);
      if (!doUserExist) {
        await prisma.user.create({
          data: {
            name,
            email,
            userName,
            hashedPassword,
          },
        });
      }

      await sendMail(email, 'sign up', 'Email verification link for signup', {
        redirectToEmailVerificationPageLink: `${baseURL}/v1/verify/${accessToken}`,
      });
      res.status(200).json({
        success: true,
        message: 'Email verification link has been sent to your mail',
      });
    } else {
      // If user signed in using google then password must be set for first sign in using email and password
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
