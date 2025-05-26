import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';
import { validatePostData } from '../../utils/schemaValidate';

const prisma = new PrismaClient();

const handleCreateNewPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
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
    const createPost = await prisma.post.create({
      data: {
        postTitle,
        postDescription,
        postBannerImage,
        published,
        postTags,
        creatorId,
      },
    });
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: createPost,
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

export default handleCreateNewPost;
