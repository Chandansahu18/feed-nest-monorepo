import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { verifyToken } from '../../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();
const handleUserAccountDelete = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { access_token } = req.cookies;
    const { data: email } = verifyToken(access_token) as JwtPayload;
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
