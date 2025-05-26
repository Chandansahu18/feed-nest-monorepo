import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const handleGetUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      throw new Error('Id not found');
    }

    const user = await prisma.user.findFirst({
      where: {
        id: id as string,
        isEmailVerified: true,
      },
      omit: {
        hashedPassword: true,
        refreshToken: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
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
    console.log(errorMessage);
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export default handleGetUser;
