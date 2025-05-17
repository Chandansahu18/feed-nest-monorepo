import { PrismaClient, User } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

interface IResponseSchema {
  success: boolean;
  message: string;
  data: User;
}

const handleUserAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, userName, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          name,
          userName,
          email,
          hashedpassword: password,
          accessToken: '1234',
          refreshToken: '1234',
        },
      });

      res.status(200).json({
        success: true,
        message: 'User has been registered successfully.',
        data: newUser,
      });
      return;
    }else{
      res.status(200).json({
        success: true,
        message: 'User already exist.',
        data: existingUser,
      });
      return;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error, please try again later';
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error 
    });
}
};

export default handleUserAuth;
