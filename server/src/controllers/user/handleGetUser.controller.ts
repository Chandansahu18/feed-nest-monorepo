import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();
const handleGetUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const { id } = req.query;
    if (!email && id) {

      const user = await prisma.user.findFirst({
        where: {
          id: id as string,
          isEmailVerified: true,
        },
        omit: {
          hashedPassword: true,
          refreshToken: true,
        },
      });
  
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        data: user,
      });      
    }else if (!id && email) {
      const user = await prisma.user.findFirst({
        where: {
          email,
          isEmailVerified: true,
        },
        omit: {
          hashedPassword: true,
          refreshToken: true,
        },
      });
  
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        data: user,
      });
    }else{
     throw new Error("Required parameters not found")
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

export default handleGetUser;
