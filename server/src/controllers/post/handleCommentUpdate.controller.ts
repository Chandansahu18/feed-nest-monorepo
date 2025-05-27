import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';
import { validatePostCommentOrCommentReply } from '../../utils/schemaValidate';

const prisma = new PrismaClient();

const handleCommentUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postCommentId, commentReplyId } = req.query;
    if (!postCommentId && !commentReplyId) {
      throw new Error('required query parameters not found');
    }

    const validContent = validatePostCommentOrCommentReply.safeParse(req.body);
    if (!validContent.data) {
      throw new Error('Comment data must be required');
    }
    const { content } = validContent.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!postCommentId && commentReplyId) {
      const commentReplyUpdate = await prisma.commentReply.update({
        where:{
         id: commentReplyId as string,
         replierId: user.id as string
        },
        data: {
          reply: content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Reply updated successfully',
        data: commentReplyUpdate,
      });
    } else if (!commentReplyId && postCommentId) {
      const postComment = await prisma.postComment.update({
        where:{
           id:postCommentId as string,
           commentorId:user.id as string
        },
        data: {
          comment: content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Comment updated successfully',
        data: postComment,
      });
    } else {
      throw new Error("data can't be updated");
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
export default handleCommentUpdate;