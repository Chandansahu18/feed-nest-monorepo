import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';
import { validatePostData } from '../../utils/schemaValidate';
import { enhanceData } from '../../utils/enhance';

const prisma = new PrismaClient();

const handleCreateNewPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { enhance } = req.query;
    if ((enhance as string) === 'true') {
      const enhancedData = await enhanceData(req.body);
      res.status(200).json({
        success: true,
        data: enhancedData,
      });
    } else {
      const validPostData = validatePostData.safeParse(req.body);
      if (!validPostData.data) {
        throw new Error('Post title must be required');
      }
      const { postTitle, postDescription, postBannerImage, published } =
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
      const isPostCreated = await prisma.post.findFirst({
        where: {
          creatorId,
          postTitle,
          postDescription,
        },
      });
      if (!isPostCreated) {
        const createPost = await prisma.post.create({
          data: {
            postTitle,
            postDescription,
            postBannerImage,
            published,
            creatorId,
          },
        });
        res.status(201).json({
          success: true,
          message: 'Post created successfully',
          data: createPost,
        });
      } else {
        res.status(409).json({
          success: true,
          message: 'Post with same content already created',
        });
      }
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
export default handleCreateNewPost;
