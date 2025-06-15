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
    const { followingUserId, userId } = req.query;
    if (!email) {
      throw new Error('Unauthorized access - please login again');
    }

    const isUserFollowedAlready = await prisma.followingRelations.findFirst({
      where: {
        userId: userId as string,
      },
    });
    if (!isUserFollowedAlready) {
      await prisma.followingRelations.create({
        data: {
          userId: userId as string,
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
        userId: userId as string,
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
 