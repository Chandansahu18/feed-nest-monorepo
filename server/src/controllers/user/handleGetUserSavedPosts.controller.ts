import { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { verifyToken } from '../../utils/authTokens';

const prisma = new PrismaClient();
const handleGetUserSavedPosts =async (
  req: Request,
  res: Response,
): Promise<void> =>{
     try {
        const { access_token } = req.cookies;
        const { data: email } = verifyToken(access_token) as JwtPayload;
      


     } catch (error) {
        
     }
}

export default handleGetUserSavedPosts;