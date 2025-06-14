import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';
import { validatePostCommentOrCommentReply } from '../../utils/schemaValidate';

const prisma = new PrismaClient();

const handleComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postId, commentId, comment } = req.body;
    if (!postId && !commentId) {
      throw new Error('post not found');
    }
   
    const validContent = validatePostCommentOrCommentReply.safeParse({comment});
    if (!validContent.data) {
      throw new Error('Comment data must be required');
    }
    const { comment:commentData } = validContent.data;

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
          userId: user?.id || "",
          commentId: commentId || "",
          comment:commentData,
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
          userId: user?.id || "",
          postId: postId || "",
          comment: commentData,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Comment submitted successfully',
        data: postComment,
      });
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
