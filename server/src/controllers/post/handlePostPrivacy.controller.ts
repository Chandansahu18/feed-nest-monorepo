import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

export const handlePostPrivacy = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { postId } = req.query;

    if (!postId) {
      throw new Error('Required query parameters unavailable');
    }
    
    const user = await prisma.user.findFirst({
        where:{
            email
        }
    })
      const creatorId = user?.id;

      const findPostPrivacy = await prisma.post.findFirst({
        where:{
            creatorId,
            id:postId as string
        }
      })
      if (!findPostPrivacy) {
        res.status(404).json({
            success:false,
            message:"Post not found"
        })
      }
    const currentPrivacyState = findPostPrivacy?.published;
    
    const changePostPrivacy = await prisma.post.update({
      where: {
        id: postId as string,
        creatorId
      },
      data: {
        published:!currentPrivacyState
      },
    });
    res.status(200).json({
        success:true,
        message:"Privacy changed successfully",
        data:changePostPrivacy
    })
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
