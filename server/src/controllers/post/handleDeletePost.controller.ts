import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

const handleDeletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { ids } = req.body;

    if (!ids) {
      throw new Error('required parameters is missing');
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
        isEmailVerified: true,
      },
    });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const creatorId = user?.id as string;
    await prisma.post.deleteMany({
      where: {
        id: {
          in: JSON.parse(ids),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Posts deleted successfully',
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
export default handleDeletePost;
