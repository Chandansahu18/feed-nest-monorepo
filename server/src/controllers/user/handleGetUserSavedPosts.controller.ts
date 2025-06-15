import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const handleGetUserSavedPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { postId, userId } = req.query;
  
    if (!userId) {
      throw new Error('required query parameters are missing');
    }

    if (!postId) {
      const savedPosts = await prisma.savedPost.findMany({
        where: {
          userId: userId as string,
        },
        include:{
          post:true
        }
      });
      
      res.status(200).json({
        success: true,
        message: 'Data retreived successfully',
        data: savedPosts,
      });
    } else {
      const savedPost = await prisma.savedPost.findFirst({
        where: {
          postId: postId as string,
          userId: userId as string
        },
        include:{
          post:true
        }
      });
      res.status(200).json({
        success:true,
        message:"Data retreived successfully",
        data:savedPost
      })
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

export default handleGetUserSavedPosts;
