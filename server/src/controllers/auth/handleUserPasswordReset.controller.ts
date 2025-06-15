import { Response, Request } from 'express';
import { PrismaClient } from '../../../generated/prisma/index';
import { compareHash, generateHash } from '../../utils/hash';
import { verifyToken } from '../../utils/authTokens';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

const frontendURL = process.env.FRONTEND_BASE_URL as string

export const handleUserPasswordReset = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.params;
    
    if (!token) {
        throw new Error("missing required url parameters");
    }

    const isResetPasswordTokenExpired = verifyToken(token) as JwtPayload;

    if (!isResetPasswordTokenExpired) {
      return res.status(404).render('resetPasswordLinkExpired');
    }
    const { data: email } = isResetPasswordTokenExpired;
    const user = await prisma.user.findUnique({
        where:{
            email,
            isEmailVerified:true
        }
    })

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    return res
      .status(200)
      .render('resetPasswordForm', { email, token });
  } catch (error:unknown) {
    return res.status(500).render('resetPasswordLinkExpired');
  }
};


export const handleNewPassword = async (req:Request, res:Response):Promise<void> => {
  try {
    // Get passwords from request body
    const { email, newPassword, confirmPassword } = req.body;

    // Verify if passwords match
    if (newPassword !== confirmPassword) {
       res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const user = await prisma.user.findUnique({
        where:{
            email,
            isEmailVerified:true
        }
    })

    if (!user) {
       res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const checkSamePassword = await compareHash(
      confirmPassword,
      user?.hashedPassword as string,
    );

    if (checkSamePassword) {
     res.status(400).json({
        success: false,
        message: "New password can't be same as old password.",
      });
    }

    // New hashed password to be saved on DB.
    const hashedPassword = await generateHash(confirmPassword);
     
    await prisma.user.update({
        where:{
            email
        },
        data:{
            hashedPassword
        }
    })

    res.status(200).json({
      success:true,
      message:"New password created successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


