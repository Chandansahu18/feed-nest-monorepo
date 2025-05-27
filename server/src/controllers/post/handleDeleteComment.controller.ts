import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

const handleDeleteComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postCommentId, commentReplyId } = req.query;
    if (!postCommentId && !commentReplyId) {
      throw new Error('required query parameters not found');
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!postCommentId && commentReplyId) {
   await prisma.commentReply.delete({
        where: {
          id: commentReplyId as string,
          replierId: user.id as string,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Reply deleted successfully'
      });
    } else if (!commentReplyId && postCommentId) {
   await prisma.postComment.delete({
        where: {
          id: postCommentId as string,
          commentorId: user.id as string,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } else {
      throw new Error('unable to delete');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Internal server error, please try again later',
    });
  }
};

export default handleDeleteComment;