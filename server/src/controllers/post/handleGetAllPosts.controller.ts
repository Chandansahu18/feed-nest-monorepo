import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IPostsDataResponse } from '@shared/types';
const prisma = new PrismaClient();

const handleGetAllPosts = async (
  req: Request,
  res: Response<IPostsDataResponse>,
): Promise<void> => {
  try {
    const { cursor } = req.query;

    // Fetch for the first time when cursor id is not provided
    if (!cursor) {
      const allPosts = await prisma.post.findMany({
        take: 5,
        where: {
          published: true,
        },
        orderBy:{createdAt:'desc'},
        include: {
          creator: {
            omit: {
              hashedPassword: true,
              refreshToken: true,
              isEmailVerified:true
            },
          },
          postLikes:true,
          postComments:true
        },
      });
      res.status(200).json({
        success: true,
        message:'Data retrieved successfully',
        data: allPosts,
      });
    }
    //  Fetch next posts data when cursor id is provided
    else {
      const allPosts = await prisma.post.findMany({
        take: 5,
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        orderBy:{createdAt:'desc'},
        where: {
          published: true,
        },
        include: {
          creator: {
            omit: {
              hashedPassword: true,
              refreshToken: true,
            },
          },
          postLikes:true,
          postComments:true
        },
      });
      res.status(200).json({
        success: true,
        message:'Data retrieved successfully',
        data: allPosts,
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

export default handleGetAllPosts;
