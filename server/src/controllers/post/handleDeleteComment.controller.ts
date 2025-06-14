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
    const { replyId, commentId } = req.query;

    if (!replyId && !commentId) {
      throw new Error('Either replyId or commentId is required');
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const targetId = (replyId || commentId) as string;
    const isReply = !!replyId;

    const target = await prisma.postComment.findUnique({
      where: { id: targetId },
      include: { post: true },
    });

    if (!target) {
      throw new Error(`${isReply ? 'Reply' : 'Comment'} not found`);
    }

    const canDelete =
      user.id === target.post?.creatorId || user.id === target.userId;

    if (!canDelete) {
      throw new Error(
        `You do not have permission to delete this ${isReply ? 'reply' : 'comment'}`,
      );
    }

    if (isReply) {
      await prisma.postComment.delete({
        where: { id: targetId },
      });
    } else {
      await prisma.postComment.deleteMany({
        where: { commentId: targetId },
      });
      await prisma.postComment.delete({
        where: { id: targetId },
      });
    }

    res.status(200).json({
      success: true,
      message: `${isReply ? 'Reply' : 'Comment'} ${isReply ? '' : 'and its replies '}deleted successfully`,
    });
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
