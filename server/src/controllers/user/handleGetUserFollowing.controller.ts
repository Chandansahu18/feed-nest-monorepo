import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();
const handleGetFollowingUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;    
    if (!email) {
      throw new Error("Unauthorized access - please login again")
    }
    const followingUsers = await prisma.followingRelations.findMany({
      where:{
        user:{
          email
        }
      }
    })
     res.status(200).json({
      success:true,
      message:"data retrieved successfully",
      data:followingUsers
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

export default handleGetFollowingUser;
