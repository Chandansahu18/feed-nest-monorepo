import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const handleGetAllPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const allPosts = await prisma.post.findMany({
      include: {
        creator: {
          omit: {
            hashedPassword: true,
            refreshToken: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      data: allPosts,
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
export default handleGetAllPosts;
