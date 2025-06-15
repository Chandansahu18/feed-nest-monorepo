import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { compareHash, generateHash } from '../../utils/hash';
import { generateToken } from '../../utils/authTokens';
import { validateUserData } from '../../utils/schemaValidate';
import sendMail from '../../utils/email';

const prisma = new PrismaClient();
const baseURL = process.env.BASE_URL as string;
const accessTokenExpiryTime = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY as string,
);
const refreshTokenExpiryTime = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY as string,
);

const handleUserAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const validUserData = validateUserData.safeParse(req.body);
    if (!validUserData.data) {
      const errors = validUserData.error?.issues;
      const errorMessage =
        errors.length === 1 ? errors[0].message : 'missing required fields';
      throw new Error(errorMessage);
    }

    const { email, name, userName, password } = validUserData.data;

    const doUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!doUserExist || !doUserExist.isEmailVerified) {
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
      const isPasswordValid = await compareHash(
        password as string,
        doUserExist?.hashedPassword as string,
      );
      const accessToken = generateToken(email, accessTokenExpiryTime);
      const refreshToken = generateToken(email, refreshTokenExpiryTime);

      if (!isPasswordValid) {
        res.status(400).json({
          success: false,
          message: 'Incorrect password',
        });
      }
      res
        .cookie('access_token', accessToken)
        .cookie('refresh_token', refreshToken);
      res.status(200).json({
        success: true,
        message: 'User signed in successfully',
      });
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
