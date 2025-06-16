import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const handleSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { searchedTerm } = req.query;
    const trimmedSearchedTerm = searchedTerm?.toString().trim();

    if (trimmedSearchedTerm && trimmedSearchedTerm?.length < 3) {
      throw new Error('Searched term must contain atleast of 3 characters');
    }

    if (!trimmedSearchedTerm) {
      throw new Error('Required query parameters are not available');
    }
    const searchedData = await prisma.post.findMany({
      where: {
        OR: [
          {
            postTitle: {
              contains: trimmedSearchedTerm as string,
              mode: 'insensitive',
            },
          },
          {
            creator: {
              OR: [
                {
                  name: {
                    contains: trimmedSearchedTerm as string,
                    mode: 'insensitive',
                  },
                },
                {
                  userName: {
                    contains: trimmedSearchedTerm as string,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
          {
            postDescription: {
              contains: trimmedSearchedTerm as string,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        creator: {
          omit: {
            hashedPassword: true,
            refreshToken: true,
          },
        },
        postComments: true,
        postLikes: true,
      },
    });
    if (!searchedData) {
      res.status(404).json({
        success: false,
        message: 'Data not found',
        data: searchedData,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: searchedData,
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

export default handleSearch;
