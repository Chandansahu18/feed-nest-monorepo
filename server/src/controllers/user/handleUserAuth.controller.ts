import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const handleUserAuth = async (req: Request, res: Response) => {
  const { email, userName, name, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email:email
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
  }
   res.status(200).json({
        success: true,
        message: "User already exists.",
        data: existingUser
    });

};

export default handleUserAuth;
