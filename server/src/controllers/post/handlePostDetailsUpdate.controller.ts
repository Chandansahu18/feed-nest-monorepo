import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IGenericMessageResponse } from '@shared/types';
import { validatePostData } from '../../utils/schemaValidate';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();
const handlePostDetailsUpdate = async (
  req: Request,
  res: Response<IGenericMessageResponse>,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postId } = req.query;

    if (!postId) {
      throw new Error('missing rewquired query parameters');
    }

    const validPostData = validatePostData.safeParse(req.body);
    if (!validPostData.data) {
      throw new Error('Post title must be required');
    }
    const { postTitle, postDescription, postBannerImage, published, postTags } =
      validPostData.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
        isEmailVerified: true,
      },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    const creatorId = user?.id as string;
    const isPostCreatedByUser = await prisma.post.findFirst({
      where: {
        id: postId as string,
        creatorId,
      },
    });
    if (!isPostCreatedByUser) {
      res.status(404).json({
        success: true,
        message: 'Post does not belongs to you',
      });
    } else {
      await prisma.post.update({
        where: {
          id: postId as string,
          creatorId,
        },
        data: {
          postTitle,
          postDescription,
          postBannerImage,
          published,
          postTags,
        },
      });
      res.status(204).json({
        success: true,
        message: 'Post updated successfully',
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
export default handlePostDetailsUpdate;
