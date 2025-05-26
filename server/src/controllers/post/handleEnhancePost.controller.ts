import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { IRequest } from '../../utils/types';
import { validatePostData } from '../../utils/schemaValidate';
import { enhanceData } from '../../utils/enhance';

const prisma = new PrismaClient();

export const handleEnhancePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {data} = req.body;
    if (!data) {
        throw new Error("required data is missing");
    }
  const enhancedData = await enhanceData(data);

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
