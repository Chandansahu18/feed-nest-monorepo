import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();
const handleAvatarUpload = async (req: Request, res: Response) => {
  try {
    const { email } = req as IRequest;
    if (!email) {
      throw new Error('Unauthorized access - please login again');
    }
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

export default handleAvatarUpload;
