import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IPostCommentOrReplyDataResponse } from '@shared/types';
import { validatePostCommentOrCommentReply } from '../../utils/schemaValidate';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

const handleComment = async (
  req: Request,
  res: Response<IPostCommentOrReplyDataResponse>,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postId, commentId, comment } = req.body;
    if (!postId && !commentId) {
      throw new Error('post not found');
    }

    const validContent = validatePostCommentOrCommentReply.safeParse({
      comment,
    });
    if (!validContent.data) {
      throw new Error('Invalid Comment format');
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
    // when postId is not available & commentId is present then user is posting a reply under a particular comment
    if (!postId && commentId) {
      const commentReply = await prisma.postComment.create({
        data: {
          userId: user?.id || '',
          commentId: commentId || '',
          comment: commentData,
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
      });

      res.status(201).json({
        success: true,
        message: 'Reply submitted successfully',
        data: commentReply,
      });
    }
    // when postId is available & commentId is not present then user is posting comment under a particular post
    else if (postId && !commentId) {
      const postComment = await prisma.postComment.create({
        data: {
          userId: user?.id || '',
          postId: postId || '',
          comment: commentData,
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
