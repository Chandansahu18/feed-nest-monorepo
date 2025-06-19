import { Request, Response } from 'express';
import { IEnhancedPostDataResponse } from '@shared/types';
import { enhanceData } from '../../utils/enhance';
import { IRequest } from '../../utils/types';

export const handleEnhancePost = async (
  req: Request,
  res: Response<IEnhancedPostDataResponse>,
): Promise<void> => {
  try {
    const {email} = req as IRequest;

    if (!email) {
        throw new Error("Unauthorized access - please login again");
    }
    const content = req.body;
    if (!content) {
        throw new Error("required data is missing");
    }
  const enhancedData = await enhanceData(content);
  res.status(200).json({
    success:true,
    message:"Data enhanced successfdully",
    data:enhancedData
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
