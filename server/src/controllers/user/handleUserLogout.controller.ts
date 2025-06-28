import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IGenericMessageResponse } from '@shared/types';

const prisma = new PrismaClient();
const accessTokenExpiryTime = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY as string,
);
const refreshTokenExpiryTime = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY as string,
);
const nodeEnv = process.env.NODE_ENV as string;
const handleUserLogout = async (
  req: Request,
  res: Response<IGenericMessageResponse>,
): Promise<void> => {
  try {
    const { access_token, refresh_token } = req.cookies;

    if (!access_token && !refresh_token) {
      throw new Error('Unauthorized access - please login again');
    }
    res
      .clearCookie('access_token', {
        httpOnly: true,
        secure: nodeEnv === 'production' ? true : false,
        sameSite: nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: accessTokenExpiryTime,
      })
      .clearCookie('refresh_token', {
        httpOnly: true,
        secure: nodeEnv === 'production' ? true : false,
        sameSite: nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: refreshTokenExpiryTime,
      })
      .status(200)
      .json({
        success: true,
        message: 'User logged out successfully',
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

export default handleUserLogout;
