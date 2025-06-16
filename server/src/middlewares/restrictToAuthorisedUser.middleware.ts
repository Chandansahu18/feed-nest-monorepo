import { Request, Response, NextFunction } from 'express';
import { generateToken, verifyToken } from '../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';
import { IRequest } from '../utils/types';

const accessTokenExpiryTime = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY as string,
);

export const restrictToAuthorisedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let bypassEndpoints: string[] = ['/v1/posts', '/v1/post', '/v1/user'];
    const isURLNeedToBypass =
      bypassEndpoints.includes(req.url) && req.method === 'GET';

    if (isURLNeedToBypass) {
      return next();
    }
    const { access_token, refresh_token } = req.cookies;
    if (!refresh_token) {
      res.clearCookie('access_token').clearCookie('refresh_token');
      res.status(401).json({
        success: false,
        message: 'Unauthorized access - please login again',
      });
      return;
    } else if (!access_token) {
      const isRefreshTokenValid = verifyToken(refresh_token as string);
      const { data: email } = isRefreshTokenValid as JwtPayload;
      const newAccessToken = generateToken(email, accessTokenExpiryTime);
      res.cookie('access_token', newAccessToken);
      (req as IRequest).email = email;
      return next();
    }
    const isRefreshTokenValid = verifyToken(refresh_token as string);
    const { data: email } = isRefreshTokenValid as JwtPayload;
    (req as IRequest).email = email;
    next();
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
