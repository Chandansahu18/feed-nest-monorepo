import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();
const handleUserFollowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { followingUserId } = req.query;
    if (!email) {
      throw new Error('Unauthorized access - please login again');
    }
    const user = await prisma.user.findFirst({
      where:{
        email
      }
    }) 
    if (!user) {
      res.status(404).json({
        success: true,
        message: 'User not found',
      });
    }
    
    if (user?.id === followingUserId) {
      res.status(400).json({
        success: true,
        message: 'User can not be followed',
      });  
    }

    const isUserFollowedAlready = await prisma.followingRelations.findFirst({
      where: {
        userId: user?.id as string,
      },
    });

    if (!isUserFollowedAlready) {
      await prisma.followingRelations.create({
        data: {
          userId: user?.id as string,
          followingUserId: followingUserId as string,
        },
      });
      res.status(204).json({
        success: true,
        message: 'User followed successfully',
      });
    }
    await prisma.followingRelations.delete({
      where: {
        id: isUserFollowedAlready?.id,
        userId: user?.id as string,
        followingUserId: followingUserId as string,
      },
    });
    res.status(204).json({
      success: true,
      message: 'User unfollowed successfully',
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

export default handleUserFollowing;
 