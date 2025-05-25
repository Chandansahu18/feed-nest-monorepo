import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { verifyToken } from '../../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

const handleGetUser = async (req: Request, res: Response) => {
  try {
    const { access_token } = req.cookies;
    const { data: email } = verifyToken(access_token) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: {
        email,
        isEmailVerified: true,
      },
      omit:{
        hashedPassword:true,
        refreshToken:true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        data: user,
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
