import { Request, Response, NextFunction } from 'express';
import { generateToken, verifyToken } from '../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';

const accessTokenExpiryTime = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY as string,
);
export const restrictToAuthorisedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { access_token, refresh_token } = req.cookies;
    if (!refresh_token) {
      res.clearCookie('access_token').clearCookie('refresh_token');
      res.status(401).json({
        success: false,
        message: 'Unauthorized access - please login again',
      });
    } else {
      if (!access_token) {
        const isRefreshTokenValid = verifyToken(refresh_token as string);
        const { data: email } = isRefreshTokenValid as JwtPayload;
        const newAccessToken = generateToken(email, accessTokenExpiryTime);
        res.cookie('access_token', newAccessToken);
        return next();
      }
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
