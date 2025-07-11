import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IPostCommentOrReplyDataResponse } from '@shared/types';
import { validatePostCommentOrCommentReply } from '../../utils/schemaValidate';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

const handleCommentUpdate = async (
  req: Request,
  res: Response<IPostCommentOrReplyDataResponse>,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { comment, id } = req.body;
    if (!id) {
      throw new Error('required query parameters not found');
    }

    const validContent = validatePostCommentOrCommentReply.safeParse({
      comment,
    });
    if (!validContent.data) {
      throw new Error('Comment data must be required');
    }
    const { comment: commentData } = validContent.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const commentUpdate = await prisma.postComment.update({
      where: {
        id: id as string,
        userId: user.id,
      },
      include: {
        post: true,
        user: {
          omit: {
            hashedPassword: true,
            refreshToken: true,
          },
        },
      },
      data: {
        comment: commentData,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Comment updated successfully',
      data: commentUpdate,
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
export default handleCommentUpdate;
