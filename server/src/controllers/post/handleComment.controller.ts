import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';
import { validatePostCommentOrCommentReply } from '../../utils/schemaValidate';

const prisma = new PrismaClient();

const handleComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postId, postCommentId } = req.query;
    if (!postId && !postCommentId) {
      throw new Error('post not found');
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

    if (!postId && postCommentId) {
      const commentReply = await prisma.commentReply.create({
        data: {
          replierId: user?.id as string,
          postCommentId: postCommentId as string,
          reply: content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Reply submitted successfully',
        data: commentReply,
      });
    } else if (postId && !postCommentId) {
      const postComment = await prisma.postComment.create({
        data: {
          commentorId: user?.id as string,
          postId: postId as string,
          comment: content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Comment submitted successfully',
        data: postComment,
      });
    } else {
      throw new Error("Comment can't be submitted");
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

export default handleComment;
