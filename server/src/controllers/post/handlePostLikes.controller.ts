import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IGenericMessageResponse } from '@shared/types';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

export const handlePostLikes = async (
  req: Request,
  res: Response<IGenericMessageResponse>,
): Promise<void> => {
  try {
    const { email } = req as IRequest; 
    const { postId } = req.query;

    if (!postId) {
        throw new Error('required query parameters are not available')
    }

    if (!email) {
      throw new Error('Unauthorized access - please login again');
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPostLiked = await prisma.postLike.findFirst({
      where: {
        postId: postId as string,
        userId: user.id,
      },
    });

    if (!isPostLiked) {
      await prisma.postLike.create({
        data: {
          postId: postId as string,
          userId: user.id,
        },
      });
      res.status(204).json({
        success: true,
        message: 'Post liked successfully',
      });
    } else {
      await prisma.postLike.delete({
        where: {
          id: isPostLiked.id,
        },
      });
      res.status(204).json({
        success: true,
        message: 'Post unliked successfully',
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
