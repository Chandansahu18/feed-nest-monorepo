import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { validateUserData } from '../../utils/schemaValidate';
import { IRequest } from '../../utils/types';

const prisma = new PrismaClient();

const handleUserDetailsUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;
    const validUserData = validateUserData.safeParse(req.body);
    if (!validUserData.data) {
      const errors = validUserData.error?.issues;
      const errorMessage =
        errors.length === 1 ? errors[0].message : 'missing required fields';
      throw new Error(errorMessage);
    }
    const { name, userName, bio, avatar, profileBanner } = validUserData.data;
    await prisma.user.update({
      where: {
        email,
        isEmailVerified: true,
      },
      data: {
        name,
        userName,
        bio,
        profileBanner,
        avatar,
      },
    });
    res.status(204).json({
      success: true,
      message: 'User data updated successfully',
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

export default handleUserDetailsUpdate;
