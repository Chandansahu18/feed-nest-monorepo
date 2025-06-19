import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IPostDataResponse } from '@shared/types';
const prisma = new PrismaClient();

const handleGetPost = async (
  req: Request,
  res: Response<IPostDataResponse>,
): Promise<void> => {
  try {
    const { postId } = req.query;
    if (!postId) {
      throw new Error('required id is missing');
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId as string,
      },
      include: {
        creator: {
          omit: {
            hashedPassword: true,
            refreshToken: true,
          },
        },
        postComments: true,
        postLikes: true,
      },
    });
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Post data retrieved successfully',
        data: post,
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

export default handleGetPost;
