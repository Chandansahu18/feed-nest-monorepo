import { Request, Response } from 'express';
import { generateToken, verifyToken } from '../../utils/authTokens';
import { PrismaClient } from '../../../generated/prisma';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();
const accessTokenExpiryTime = parseInt(process.env.ACCESS_TOKEN_EXPIRY as string) ;
const refreshTokenExpiryTime = parseInt(process.env.REFRESH_TOKEN_EXPIRY as string) ;
const nodeEnv = process.env.NODE_ENV as string
export const handleUserEmailVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.params.token;    
    if (!token) {
      throw new Error('verification token missing.');
    }
    const verifiedToken = verifyToken(token) as JwtPayload;
    const { data: email } = verifiedToken;    
    const accessToken = generateToken(email, accessTokenExpiryTime);
    const refreshToken = generateToken(email, refreshTokenExpiryTime);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isEmailVerified: true,
        refreshToken,
      },
    });
    
    res.cookie('access_token', accessToken,{
      httpOnly: true,
      secure: nodeEnv === 'production' ? true : false, 
      sameSite: nodeEnv === 'production' ? 'none' : 'lax', 
      maxAge: accessTokenExpiryTime, 
    }).cookie('refresh_token', refreshToken,{
      httpOnly: true,
     secure: nodeEnv === 'production' ? true : false, 
      sameSite: nodeEnv === 'production' ? 'none' : 'lax', 
      maxAge: accessTokenExpiryTime, 
    });
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Invalid or expired verification link.';

    res.status(400).json({
      success: false,
      message: error,
    });
  }
};
