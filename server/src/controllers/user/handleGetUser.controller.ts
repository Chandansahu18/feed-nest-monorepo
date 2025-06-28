import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { verifyToken } from '../../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';
import { IUserDataResponse } from '@shared/types';

const prisma = new PrismaClient();

const sendUserNotFoundResponse = (
  res: Response,
  success: boolean,
  message: string,
) => {
  res.status(404).json({
    success,
    message,
  });
};

const handleGetUser = async (
  req: Request,
  res: Response<IUserDataResponse>,
): Promise<void> => {
  try {
    const { id } = req.query;
    const { refresh_token } = req.cookies;

    const includeDataCondition = {
      followingRelations: true,
      posts: true,
      postLikes: true,
      postComments: true,
    };
    const omitCondition = { hashedPassword: true, refreshToken: true };

    if (!refresh_token && !id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access - please login again',
      });
    }
    // Authenticated user try to get own data
    else if (!id && refresh_token) {
      const isRefreshTokenValid = verifyToken(refresh_token);
      const { data: email } = isRefreshTokenValid as JwtPayload;

      const user = await prisma.user.findFirst({
        where: { email, isEmailVerified: true },
        include: includeDataCondition,
        omit: omitCondition,
      });
      if (!user) {
        sendUserNotFoundResponse(res, false, 'User not found');
      }

      res.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        data: user,
      });
    }
    // Authenticated user try to get specific user's data
    else if (refresh_token && id) {
      const user = await prisma.user.findFirst({
        where: { id: id as string, isEmailVerified: true },
        include: includeDataCondition,
        omit: omitCondition,
      });
      if (!user) {
        sendUserNotFoundResponse(res, false, 'User not found');
      }
      res.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        data: user,
      });
    }
    // Unauthenticated user try to get a specific user's details
    else if (!refresh_token && id) {
      const user = await prisma.user.findFirst({
        where: { id: id as string, isEmailVerified: true },
        include: includeDataCondition,
        omit: omitCondition,
      });
      if (!user) {
        sendUserNotFoundResponse(res, false, 'User not found');
      }

      res.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        data: user,
      });
    }
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

export default handleGetUser;
