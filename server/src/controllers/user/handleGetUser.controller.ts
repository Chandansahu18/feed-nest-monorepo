import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { verifyToken } from '../../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';
import { IUserDataResponse } from '@shared/types';

const prisma = new PrismaClient();

const handleGetUser = async (req: Request, res: Response<IUserDataResponse>): Promise<void> => {
  try {
    const { access_token } = req.cookies;
    const isAccessTokenValid = verifyToken(access_token);
    const { data: email } = isAccessTokenValid as JwtPayload;
    const { id } = req.query;

    if (!email && !id) {
      throw new Error('Required parameters not found');
    }

    const queryCondition = email && !id 
      ? { email, isEmailVerified: true }
      : { id: id as string, isEmailVerified: true };

    const user = await prisma.user.findFirst({
      where: queryCondition,
      include:{
        followingRelations:true,
        posts:true,
        postLikes:true,
        postComments:true
      },
      omit: {
        hashedPassword: true,
        refreshToken: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      data: user,
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

export default handleGetUser;