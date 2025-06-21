import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IGenericMessageResponse } from '@shared/types';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();
const handleUserAccountDelete = async (
  req: Request,
  res: Response<IGenericMessageResponse>,
): Promise<void> => {
  try {
    const { email } = req as IRequest;

    if (!email) {
      throw new Error('Unauthorized access - please login again');
    }

    await prisma.user.delete({
      where: {
        email,
        isEmailVerified: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
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
export default handleUserAccountDelete;
