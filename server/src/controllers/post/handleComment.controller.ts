import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

const handleComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postId, content, postCommentId } = req.body;

    if (!content) {
      throw new Error('Missing required content');
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!postId && !postCommentId) {
      throw new Error('post not found');
    } else if (!postId && postCommentId) {
      const commentReply = await prisma.commentReply.create({
        data: {
          replierId: user?.id as string,
          postCommentId,
          reply: content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Reply submitted successfully',
        data: commentReply,
      });
    } else {
      const postComment = await prisma.postComment.create({
        data: {
          commentorId: user?.id as string,
          postId,
          comment: content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Comment submitted successfully',
        data: postComment,
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

export default handleComment;