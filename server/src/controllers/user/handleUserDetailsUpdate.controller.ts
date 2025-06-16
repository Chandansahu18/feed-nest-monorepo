import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { validateUserData } from '../../utils/schemaValidate';
import { IRequest } from '../../utils/types';
import { error } from 'console';

const prisma = new PrismaClient();

const handleUserDetailsUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req as IRequest;

    if (!email) {
      throw new Error('Unauthorized access - please login again');
    }

    const validUserData = validateUserData.safeParse(req.body);
    if (!validUserData.data) {
      const errors = validUserData.error?.issues;
      const errorMessage =
        errors.length === 1 ? errors[0].message : errors.map(err => err.message).join(' & ');
      throw new Error(errorMessage);
    }
    const { name, userName, bio, avatar, profileBanner, linkedInHandle, githubHandle, twitterHandle } = validUserData.data;
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
        linkedInHandle,
        twitterHandle,
        githubHandle
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
