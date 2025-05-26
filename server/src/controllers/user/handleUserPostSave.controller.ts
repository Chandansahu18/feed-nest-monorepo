import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const handleUserPostSave = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { postId, userId } = req.query;

    if (!userId || !postId) {
      throw new Error('required query parameters are missing');
    }
    const isPostSaved = await prisma.savedPost.findFirst({
      where: {
        userId: userId as string,
        postId: postId as string,
      },
    });

    if (isPostSaved) {
        await prisma.savedPost.deleteMany({
          where: {
            postId: isPostSaved.postId,
            userId: isPostSaved.userId,
          },
        });
  
        res.status(200).json({
          success: true,
          message: 'Post unsaved successfully',
        });
    } else {
      await prisma.savedPost.create({
        data: {
          postId: postId as string,
          userId: userId as string,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Post saved successfully',
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal server error, please try again later';
    console.log(errorMessage);
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export default handleUserPostSave;
